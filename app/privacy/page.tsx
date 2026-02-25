export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#041322] text-gray-300 px-4 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <h3>1. Introduction</h3>
        <p>
          Welcome to Homie. We respect your privacy and are committed to
          protecting your personal data.
        </p>

        <h3>2. Information We Collect</h3>
        <p>When you use Homie, we may collect:</p>
        <ul>
          <li>
            <strong>Identity Data:</strong> Name, email address (via
            Google/Email sign up).
          </li>
          <li>
            <strong>Verification Data:</strong> Student ID or NIN images (used
            strictly for verification and then secured).
          </li>
          <li>
            <strong>Contact Data:</strong> Phone numbers for WhatsApp
            connections.
          </li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your data to:</p>
        <ul>
          <li>Facilitate connections between students and landlords.</li>
          <li>Verify identities to prevent scams.</li>
          <li>Improve our platform security.</li>
        </ul>

        <h3>4. Data Security</h3>
        <p>
          We implement security measures to protect your data. Verification
          documents are stored securely and only accessible by admins.
        </p>

        <h3>5. Contact Us</h3>
        <p>
          If you have questions about this policy, contact us at
          support@homie.com.
        </p>
      </div>
    </div>
  );
}
