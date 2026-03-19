import Link from 'next/link'

export const metadata = { title: 'Terms & Conditions — True To Detail' }

export default function TermsPage() {
  return (
    <div style={{ background: '#F5F4F1', minHeight: '100vh' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: 'clamp(64px, 8vw, 120px) clamp(24px, 5vw, 48px)' }}>

        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(12,12,12,0.38)', textDecoration: 'none',
            marginBottom: '48px',
          }}
        >
          ← Back
        </Link>

        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#E84A0C', marginBottom: '16px',
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 80px)',
          letterSpacing: '0.02em', lineHeight: 0.9,
          color: '#0C0C0C', marginBottom: '40px',
        }}>
          TERMS &amp;<br />CONDITIONS
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(12,12,12,0.38)', marginBottom: '48px' }}>
          Last updated: March 2025
        </p>

        <div style={{ borderTop: '1px solid rgba(12,12,12,0.1)' }}>
          {[
            {
              heading: '1. Services',
              body: 'True To Detail provides mobile car detailing services in Hertfordshire and surrounding areas. All services are performed at the address provided at the time of booking. We reserve the right to decline or reschedule bookings at our discretion.',
            },
            {
              heading: '2. Bookings',
              body: 'Bookings are requests and are not confirmed until you receive written or verbal confirmation from True To Detail. We will confirm within one hour of receiving your request during working hours (Mon–Sat, 8am–7pm). We reserve the right to cancel or reschedule due to unforeseen circumstances, in which case we will give as much notice as possible.',
            },
            {
              heading: '3. Pricing',
              body: 'All prices shown on our website are inclusive of VAT (where applicable) and are correct at the time of display. The price quoted at the time of booking is fixed and will not change unless additional work is agreed in writing before the service begins.',
            },
            {
              heading: '4. Payment',
              body: 'Payment is due on the day of service, upon completion. We accept cash, bank transfer, and card payments. We do not require a deposit. In the event of a no-show or last-minute cancellation (less than 24 hours notice), we reserve the right to charge a cancellation fee of up to 50% of the agreed price.',
            },
            {
              heading: '5. Cancellations',
              body: 'You may cancel or reschedule your booking at any time. We ask for at least 24 hours notice where possible. Cancellations within 24 hours of the appointment may incur a fee as described in Section 4.',
            },
            {
              heading: '6. Access & Preparation',
              body: 'You are responsible for ensuring we have adequate access to the vehicle on the day of the booking. We bring all necessary equipment including power and water. You do not need to prepare the vehicle. Failure to provide access may result in a cancellation charge.',
            },
            {
              heading: '7. Liability',
              body: 'True To Detail takes all reasonable care when servicing your vehicle. We are not liable for pre-existing damage or defects discovered during the service. We recommend you inform us of any known damage before the service begins. Our liability is limited to the cost of the service provided.',
            },
            {
              heading: '8. Complaints',
              body: 'If you are not satisfied with the service, please contact us within 24 hours of the service being completed. We will make every reasonable effort to resolve your concern, which may include a re-visit or partial refund at our discretion.',
            },
            {
              heading: '9. Governing Law',
              body: 'These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
            },
            {
              heading: '10. Contact',
              body: 'For any questions regarding these terms, contact us at hello@truetodetail.co.uk or 07984 237149.',
            },
          ].map(section => (
            <div
              key={section.heading}
              style={{ padding: '28px 0', borderBottom: '1px solid rgba(12,12,12,0.08)' }}
            >
              <h2 style={{
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px',
                color: '#0C0C0C', marginBottom: '10px',
              }}>
                {section.heading}
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.78,
                color: 'rgba(12,12,12,0.55)', margin: 0,
              }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
