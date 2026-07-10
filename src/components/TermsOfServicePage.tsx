import LegalPage, { LegalSection } from '@/components/legal/LegalPage'

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service">
      <p className="max-w-2xl text-base leading-relaxed text-muted-text sm:text-lg">
        Please read these terms of service carefully before using our service.
      </p>

      <LegalSection title="1. Agreement to Terms">
        <p>
          These Terms of Service constitute a legally binding agreement made between you, whether
          personally or on behalf of an entity (&ldquo;you&rdquo;) and gregscompendium.com
          (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;), concerning your access to and
          use of the gregscompendium.com website as well as any other media form, media channel,
          mobile website or mobile application related, linked, or otherwise connected thereto
          (collectively, the &ldquo;Site&rdquo;).
        </p>
      </LegalSection>

      <LegalSection title="2. User Representations">
        <p>By using the Site, you represent and warrant that:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>All registration information you submit will be true, accurate, current, and complete;</li>
          <li>
            You will maintain the accuracy of such information and promptly update such
            registration information as necessary;
          </li>
          <li>You have the legal capacity and you agree to comply with these Terms of Service;</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Prohibited Activities">
        <p>
          You may not access or use the Site for any purpose other than that for which we make the
          Site available. The Site may not be used in connection with any commercial endeavors
          except those that are specifically endorsed or approved by us.
        </p>
      </LegalSection>

      <LegalSection title="4. User Generated Contributions">
        <p>
          The Site may invite you to contribute to, or participate in lists, and other
          functionality, and may provide you with the opportunity to create, submit, post,
          display, transmit, perform, publish, distribute, or broadcast content and materials to
          us or on the Site.
        </p>
      </LegalSection>

      <LegalSection title="5. Site Management">
        <p>
          We reserve the right, but not the obligation, to: (1) monitor the Site for violations of
          these Terms of Service; (2) take appropriate legal action against anyone who, in our sole
          discretion, violates the law or these Terms of Service; (3) manage the Site in a manner
          designed to protect our rights and property and to facilitate the proper functioning of
          the Site.
        </p>
      </LegalSection>

      <LegalSection title="6. Modifications and Interruptions">
        <p>
          We reserve the right to change, modify, or remove the contents of the Site at any time or
          for any reason at our sole discretion without notice. However, we have no obligation to
          update any information on our Site. We also reserve the right to modify or discontinue
          all or part of the Site without notice at any time.
        </p>
      </LegalSection>

      <LegalSection title="7. Governing Law">
        <p>
          These Terms shall be governed by and defined following the laws of the United States.
          gregscompendium.com and yourself irrevocably consent that the courts of the United States
          shall have exclusive jurisdiction to resolve any dispute which may arise in connection
          with these terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact Us">
        <p>
          In order to resolve a complaint regarding the Site or to receive further information
          regarding use of the Site, please contact us at:{' '}
          <a href="mailto:0xgcs1@gmail.com" className="text-accent hover:underline">
            0xgcs1@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
