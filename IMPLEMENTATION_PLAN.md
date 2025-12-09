# Fee Management System Implementation Plan

## Updated with Complete Fee Structure

This plan implements a complete fee management system following the 5-phase approach with the provided fee structure.

## Fee Structure

### Maharashtra Board
- Class 10 → 900
- Class 9 → 650
- Class 8 → 550
- Class 7 → 500
- Class 6 → 450
- Class 5 → 400
- Class 4 → 450
- Class 3 → 300
- Class 2 → 250
- Class 1 → 250

### CBSE Board
- Class 10 → 1500
- Class 9 → 1000
- Class 8 → 800
- Class 7 → 700
- Class 6 → 600
- Class 5 → 550
- Class 4 → 400
- Class 3 → 350
- Class 2 → 350
- Class 1 → 350

## Phase 1: Environment & Security Setup

### Step 1.1: Google Cloud Console Setup
- Create project `SciFun-Fees` in Google Cloud Console
- Enable Google Drive API
- Create Service Account and download JSON key
- Rename key to `service-account.json` and place in project root
- Update `.gitignore` to include `service-account.json`

### Step 1.2: Environment Variables
- Create `.env.local` file in project root with:
  - `GOOGLE_DRIVE_FOLDER_ID` (to be filled after folder creation)
  - Note: Firebase config remains in `src/firebaseConfig.js` as per preference

### Step 1.3: Google Drive Folder Setup
- Create folder `SciFun_Receipts_Public` in Google Drive
- Share with Service Account email (Editor role)
- Share with "Anyone with the link" (Viewer role)
- Copy Folder ID to `.env.local`

## Phase 2: Registration Module

### Step 2.1: Fee Constants File
- Create `src/utils/feeConstants.js` with complete `FEE_CHART`:
  ```javascript
  export const FEE_CHART = {
    "Maharashtra": {
      "1": 250, "2": 250, "3": 300, "4": 450, "5": 400,
      "6": 450, "7": 500, "8": 550, "9": 650, "10": 900
    },
    "CBSE": {
      "1": 350, "2": 350, "3": 350, "4": 400, "5": 550,
      "6": 600, "7": 700, "8": 800, "9": 1000, "10": 1500
    }
  };
  ```

### Step 2.2: Update Registration Page
- Modify `src/app/register/page.js`:
  - Add `board` field to `formData` state (default: '')
  - Add board selection UI (radio buttons or select):
    - Options: "Maharashtra", "CBSE"
    - Required field
  - Add fee display section that shows:
    - Selected Board + Class → Display Fee
    - Update dynamically when board or class changes
  - Import `FEE_CHART` from `src/utils/feeConstants.js`
  - In `handleRegister` function:
    - Extract class number from `selectedClass` (e.g., "Class 8" → "8")
    - Validate `FEE_CHART[board][class]` exists before registration
    - Get fee: `const selectedFee = FEE_CHART[board][class]`
    - Get current month: `const startMonth = new Date().getMonth()`
    - Add `feeConfig` object to `newStudentProfile`:
      ```javascript
      feeConfig: {
        board: board,
        class: classNumber,
        monthlyFee: Number(selectedFee),
        sessionStartMonth: startMonth,
        sessionYear: new Date().getFullYear(),
        totalPaid: 0,
        totalDiscount: 0
      }
      ```
    - Add empty `transactions` and `adjustments` arrays to profile

## Phase 3: Backend API Development

### Step 3.1: Install Dependencies
- Run: `npm install googleapis pdfkit`
- Add to `package.json` dependencies

### Step 3.2: Create Receipt Generation API
- Create `src/app/api/generate-receipt/route.js`:
  - Server-side only (no client exposure)
  - Initialize Google Auth using `service-account.json` file
  - Use `googleapis` to create Drive client
  - Generate PDF using `pdfkit` with:
    - Student Name
    - Amount
    - Date
    - Transaction ID (unique)
    - Board and Class information
  - Upload to Google Drive folder (from `GOOGLE_DRIVE_FOLDER_ID`)
  - File naming: `Receipt_${studentName}_${Date.now()}.pdf`
  - Generate public download link: `https://drive.google.com/uc?export=download&id=${fileId}`
  - Return `{ success: true, link: downloadLink, transactionId: id }`
  - Error handling with appropriate status codes

## Phase 4: Admin Panel Development

### Step 4.1: Create Admin Fees Page
- Create `src/app/admin/fees/page.js`:
  - Add admin authentication check (use `checkAdminRole` from `src/utils/adminAuth.js`)
  - Redirect to `/admin` if not admin
  - Search bar to find students by UID or Email
  - Display student info and current fee status (board, class, monthly fee, due amount)

### Step 4.2: Collect Fee Functionality
- Add "Collect Fee" section:
  - Input: Amount (Number, validate `< 0`)
  - Button with loading state (disable on click)
  - On submit:
    - Call `/api/generate-receipt` with student data
    - If API fails, show error and stop
    - If API succeeds, use Firestore transaction:
      - Update `feeConfig.totalPaid` using `increment(amount)`
      - Add to `transactions` array using `arrayUnion`:
        ```javascript
        {
          amount: Number(amount),
          date: new Date().toISOString(),
          receiptLink: link,
          transactionId: transactionId
        }
        ```
    - Show success message

### Step 4.3: Add Adjustment Functionality
- Add "Add Adjustment" section:
  - Inputs: Amount, Reason
  - On submit:
    - Use Firestore update (no API needed):
      - Update `feeConfig.totalDiscount` using `increment(amount)`
      - Add to `adjustments` array:
        ```javascript
        {
          amount: Number(amount),
          reason: reason,
          date: new Date().toISOString()
        }
        ```

## Phase 5: Student Dashboard

### Step 5.1: Fee Calculation Function
- Update `src/app/dashboard/page.js`:
  - Add `calculateDue` function:
    ```javascript
    const calculateDue = (config) => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      let monthsPassed = ((currentYear - config.sessionYear) * 12) + 
                         (currentMonth - config.sessionStartMonth) + 1;
      if (monthsPassed < 0) monthsPassed = 0;
      
      const totalExpected = monthsPassed * config.monthlyFee;
      const due = totalExpected - config.totalPaid - config.totalDiscount;
      return due < 0 ? 0 : due; // Prevent negative due
    };
    ```

### Step 5.2: Dashboard UI Updates
- Add fee status card:
  - Red background if `due > 0`
  - Green background if `due === 0`
  - Display: Board, Class, Monthly Fee, Due Amount, Total Paid, Total Discount
- Add transactions list:
  - Map through `transactions` array
  - Sort by date (newest first): `transactions.sort((a,b) => new Date(b.date) - new Date(a.date))`
  - Show "Download Receipt" button only if `item.receiptLink` exists
  - Display: Date, Amount, Transaction ID, Download button

## Implementation Flow

1. User selects Board (Maharashtra or CBSE)
2. User selects Class (1-10)
3. System displays fee based on board + class combination
4. On registration, feeConfig is saved with board, class, and monthlyFee
5. Admin can collect fees and generate receipts
6. Student dashboard calculates and displays due amount

## Files to Create/Modify

**New Files:**
- `src/utils/feeConstants.js` (with complete fee structure)
- `.env.local`
- `src/app/api/generate-receipt/route.js`
- `src/app/admin/fees/page.js`

**Modified Files:**
- `src/app/register/page.js` (add board selection, fee display, feeConfig)
- `src/app/dashboard/page.js` (add fee calculation and display)
- `.gitignore` (add service-account.json)
- `package.json` (add googleapis and pdfkit)

