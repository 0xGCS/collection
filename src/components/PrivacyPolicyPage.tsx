import LegalPage, { LegalSection } from '@/components/legal/LegalPage'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="max-w-2xl text-base leading-relaxed text-muted-text sm:text-lg">
        Your privacy is important. It is our intention to respect your privacy regarding any
        information we may collect from you across our website, https://gregscompendium.com.
      </p>

      <LegalSection title="1. Introduction">
        <p>
          Welcome to Greg&rsquo;s Compendium. We are committed to protecting your personal
          information and your right to privacy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          We collect personal information that you voluntarily provide to us when registering at
          gregscompendium.com or contacting us. Specifically, we collect:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Email Address</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the personal information collected for the following purposes:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To provide and manage our services</li>
          <li>To manage user accounts</li>
          <li>To send administrative information to you</li>
          <li>To enforce our terms, conditions, and policies</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Sharing Your Information">
        <p>We may process or share your data that we hold based on the following legal basis:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Consent</li>
          <li>Performance of a Contract</li>
          <li>Legal Obligations</li>
          <li>Vital Interests</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We have implemented appropriate technical and organizational security measures designed
          to protect the security of any personal information we process. However, please also
          remember that we cannot guarantee that the internet itself is 100% secure.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact Us">
        <p>
          If you have any questions or concerns about our policy, or our practices with regards to
          your personal information, please contact us at{' '}
          <a href="mailto:0xgcs1@gmail.com" className="text-accent hover:underline">
            0xgcs1@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
