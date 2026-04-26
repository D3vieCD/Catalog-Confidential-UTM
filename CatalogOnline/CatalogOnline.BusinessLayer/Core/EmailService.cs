using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CatalogOnline.BusinessLayer.Core
{
     public static class EmailService
     {
          private static string From => EmailSession.From;
          private static string Host => EmailSession.Host;
          private static int Port => EmailSession.Port;
          private static string UserName => EmailSession.UserName;
          private static string Password => EmailSession.Password;

          public static void SendVerificationCodeEmail(string toEmail, string toName, string code)
          {
               var message = new MimeMessage();
               message.From.Add(new MailboxAddress("AcademiX", From));
               message.To.Add(new MailboxAddress(toName, toEmail));
               message.Subject = "Cod de verificare – AcademiX";

               message.Body = new TextPart("html")
               {
                    Text = $@"
<div style=""font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;"">
  <h2 style=""color: #4f46e5;"">Verificare email</h2>
  <p>Bună, {toName}!</p>
  <p>Folosește codul de mai jos pentru a-ți verifica adresa de email:</p>
  <div style=""text-align:center;margin:24px 0;"">
    <span style=""display:inline-block;padding:16px 32px;background:#f3f4f6;border-radius:12px;
                 font-size:32px;font-weight:bold;letter-spacing:8px;color:#1f2937;"">
      {code}
    </span>
  </div>
  <p style=""color:#6b7280;font-size:14px;"">Codul expiră în <strong>15 minute</strong>.</p>
  <p style=""color:#6b7280;font-size:14px;"">
    Dacă nu ai creat un cont AcademiX, poți ignora acest email.
  </p>
  <hr style=""border:none;border-top:1px solid #e5e7eb;margin:24px 0;""/>
  <p style=""color:#9ca3af;font-size:12px;"">AcademiX – Catalog Online</p>
</div>"
               };

               using var client = new SmtpClient();
               client.Connect(Host, Port, SecureSocketOptions.StartTls);
               client.Authenticate(UserName, Password);
               client.Send(message);
               client.Disconnect(true);
          }

          public static void SendPasswordResetEmail(string toEmail, string toName, string resetLink)
          {
               var message = new MimeMessage();
               message.From.Add(new MailboxAddress("AcademiX", From));
               message.To.Add(new MailboxAddress(toName, toEmail));
               message.Subject = "Resetare parolă – AcademiX";

               message.Body = new TextPart("html")
               {
                    Text = $@"
<div style=""font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;"">
  <h2 style=""color: #4f46e5;"">Resetare parolă</h2>
  <p>Bună, {toName}!</p>
  <p>Am primit o solicitare de resetare a parolei pentru contul tău AcademiX.</p>
  <p>Apasă pe butonul de mai jos pentru a-ți seta o nouă parolă:</p>
  <a href=""{resetLink}""
     style=""display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;
            text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;"">
    Resetează parola
  </a>
  <p style=""color:#6b7280;font-size:14px;"">Linkul expiră în <strong>30 de minute</strong>.</p>
  <p style=""color:#6b7280;font-size:14px;"">
    Dacă nu ai solicitat resetarea parolei, poți ignora acest email.
  </p>
  <hr style=""border:none;border-top:1px solid #e5e7eb;margin:24px 0;""/>
  <p style=""color:#9ca3af;font-size:12px;"">AcademiX – Catalog Online</p>
</div>"
               };

               using var client = new SmtpClient();
               client.Connect(Host, Port, SecureSocketOptions.StartTls);
               client.Authenticate(UserName, Password);
               client.Send(message);
               client.Disconnect(true);
          }
     }
}
