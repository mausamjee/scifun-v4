// pages/contact.js
import Head from 'next/head'


export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - SciFun</title>
      </Head>

      <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg">We'd love to hear from you. Whether you're curious about our courses, need support, or just want to say hi – we're here for you!</p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tell us what you need help with..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </section></>
  
  )
}
export function Login() {
  return (
    <>
      <Head>
        <title>Login - SciFun</title>
      </Head>
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Login to SciFun</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
          </p>
        </div>
      </section>
    </>
  );
}