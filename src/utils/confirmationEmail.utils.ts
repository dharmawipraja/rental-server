
import { JwtService } from '@nestjs/jwt';

import { User } from "src/modules/user/schemas/user.schema";

export const handleConfirmationEmail = async (jwtService: JwtService, user: User) => {
  const emailToken = await jwtService.sign({ email: user.email });

  console.log('emailToken', emailToken)
}
