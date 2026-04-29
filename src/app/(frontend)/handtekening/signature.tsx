// Logo URL: tijdens dev de Vercel-preview, na launch productie. Wissel hier.
const LOGO_URL =
  'https://genteq-2-git-dev-geoffreyfeitsma-1339s-projects.vercel.app/images/genteq-logo-signature.png'

const TABLE_STYLE =
  'font-family: Arial, Helvetica, sans-serif; color: #1c1c1c; font-size: 13px; line-height: 1.5;'

export const SIGNATURE_HTML = `<table cellpadding="0" cellspacing="0" border="0" style="${TABLE_STYLE}">
  <tr>
    <td style="padding-right: 18px; vertical-align: top; border-right: 2px solid #375d6f;">
      <img src="${LOGO_URL}" alt="GENTEQ" width="180" height="29" style="display: block; border: 0; outline: none; text-decoration: none;" />
    </td>
    <td style="padding-left: 18px; vertical-align: top;">
      <table cellpadding="0" cellspacing="0" border="0" style="${TABLE_STYLE}">
        <tr>
          <td style="font-size: 15px; font-weight: bold; color: #1c1c1c; padding-bottom: 2px;">Andy Van Endert</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #375d6f; padding-bottom: 8px; letter-spacing: 0.3px;">GENTEQ bv</td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 2px;"><a href="tel:+32492994879" style="color: #1c1c1c; text-decoration: none;">+32 492 99 48 79</a></td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 2px;"><a href="mailto:andy@genteq.be" style="color: #1c1c1c; text-decoration: none;">andy@genteq.be</a></td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #1c1c1c; padding-bottom: 8px;"><a href="https://www.genteq.be" style="color: #375d6f; text-decoration: none; font-weight: bold;">www.genteq.be</a></td>
        </tr>
        <tr>
          <td style="font-size: 11px; color: #6b6b6b; line-height: 1.5;">Kleinstraat 13, 3500 Hasselt</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`

const cellBase: React.CSSProperties = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  color: '#1c1c1c',
  fontSize: 13,
  lineHeight: 1.5,
}

export function SignatureBlock() {
  return (
    <table cellPadding={0} cellSpacing={0} style={cellBase}>
      <tbody>
        <tr>
          <td
            style={{
              paddingRight: 18,
              verticalAlign: 'top',
              borderRight: '2px solid #375d6f',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="GENTEQ"
              width={180}
              height={29}
              style={{ display: 'block', border: 0 }}
            />
          </td>
          <td style={{ paddingLeft: 18, verticalAlign: 'top' }}>
            <table cellPadding={0} cellSpacing={0} style={cellBase}>
              <tbody>
                <tr>
                  <td
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      paddingBottom: 2,
                    }}
                  >
                    Andy Van Endert
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: 12,
                      color: '#375d6f',
                      paddingBottom: 8,
                      letterSpacing: 0.3,
                    }}
                  >
                    GENTEQ bv
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 2 }}>
                    <a
                      href="tel:+32492994879"
                      style={{ color: '#1c1c1c', textDecoration: 'none' }}
                    >
                      +32 492 99 48 79
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 2 }}>
                    <a
                      href="mailto:andy@genteq.be"
                      style={{ color: '#1c1c1c', textDecoration: 'none' }}
                    >
                      andy@genteq.be
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 12, paddingBottom: 8 }}>
                    <a
                      href="https://www.genteq.be"
                      style={{
                        color: '#375d6f',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      www.genteq.be
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontSize: 11, color: '#6b6b6b' }}>
                    Kleinstraat 13, 3500 Hasselt
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
