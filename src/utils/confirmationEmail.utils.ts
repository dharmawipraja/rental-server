import * as nodemailer from 'nodemailer';

import { User } from 'src/modules/user/schemas/user.schema';

export const handleConfirmationEmail = async (
  emailToken: string,
  user: User
) => {
  // For now we use mock SMTP server using Ethereal
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'jamir.ryan@ethereal.email',
      pass: 'ygswuhMpuppkKamKWd'
    }
  });
  // clientHost shoul be directed to your FE web address, and the FE will handle the mutation for confirm user
  const clientHost = 'http://localhost:3003/user/confirmation';
  const url = `${clientHost}/${emailToken}`;

  transporter.sendMail({
    from: 'No Reply <info-rental@example.com>',
    to: user.email,
    subject: 'Rental Email Confirmation',
    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  });
};
