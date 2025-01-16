import { User } from "@clerk/express";
import { userProfileStore } from "@models/userProfile";
import { HTTP, Result, createError } from "@senseii/types";
import { infoLogger } from "@utils/logger";
import { Request, Response } from "express";
import { Webhook } from "svix";

export const handleWebhook = async (req: Request, res: Response): Promise<Result<null>> => {
  // infoLogger({ message: "handling webhook" })
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({
      success: false,
      message: 'Error: Missing svix headers',
    });
    return {
      success: false,
      error: createError(HTTP.STATUS.INTERNAL_SERVER_ERROR, "Error: Missing svix headers")
    }
  }

  let evt: any

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id as string,
      'svix-timestamp': svix_timestamp as string,
      'svix-signature': svix_signature as string,
    });
  } catch (err) {
    console.log('Error: Could not verify webhook:', err);
    res.status(400).json({
      success: false,
      message: err,
    });
    return {
      success: false,
      error: createError(HTTP.STATUS.INTERNAL_SERVER_ERROR, "Error: Missing svix headers")
    }
  }

  // const checkUser: User = {
  //   backup_code_enabled: false,
  //   banned: false,
  //   create_organization_enabled: true,
  //   created_at: 1736679167802,
  //   delete_self_enabled: true,
  //   email_addresses: [
  //     {
  //       created_at: 1736679166071,
  //       email_address: 'prateeksingh9741@gmail.com',
  //       id: 'idn_2rWeGxcfUyIDeLErdTD3JsPOMFc',
  //       linked_to: [Array],
  //       matches_sso_connection: false,
  //       object: 'email_address',
  //       reserved: false,
  //       updated_at: 1736679167842,
  //       verification: [Object]
  //     }
  //   ],
  //   enterprise_accounts: [],
  //   external_accounts: [
  //     {
  //       approved_scopes: 'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
  //       created_at: 1736679166053,
  //       email_address: 'prateeksingh9741@gmail.com',
  //       family_name: 'singh',
  //       given_name: 'prateek',
  //       google_id: '103217116590857604956',
  //       id: 'idn_2rWeH17KoDAiQkVOim4Vq0210gh',
  //       label: null,
  //       object: 'google_account',
  //       picture: 'https://lh3.googleusercontent.com/a/ACg8ocJFzwve6eBvaC_GN5H1dJDpooCdxjG8vwacPL3kywT1H7RwUQx0=s1000-c',
  //       public_metadata: {},
  //       updated_at: 1736679166053,
  //       username: null,
  //       verification: [Object]
  //     }
  //   ],
  //   external_id: null,
  //   first_name: 'prateek',
  //   has_image: true,
  //   id: 'user_2rWeH5hO7LgveMigGc7akKxQ2nQ',
  //   image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycldlSENTWmgxRUJveEJPMjhYRnFCZXVyQnkifQ',
  //   last_active_at: 1736679167800,
  //   last_name: 'singh',
  //   last_sign_in_at: null,
  //   legal_accepted_at: null,
  //   locked: false,
  //   lockout_expires_in_seconds: null,
  //   mfa_disabled_at: null,
  //   mfa_enabled_at: null,
  //   object: 'user',
  //   passkeys: [],
  //   password_enabled: false,
  //   phone_numbers: [],
  //   primary_email_address_id: 'idn_2rWeGxcfUyIDeLErdTD3JsPOMFc',
  //   primary_phone_number_id: null,
  //   primary_web3_wallet_id: null,
  //   private_metadata: {},
  //   profile_image_url: 'https://images.clerk.dev/oauth_google/img_2rWeHCSZh1EBoxBO28XFqBeurBy',
  //   public_metadata: {},
  //   saml_accounts: [],
  //   totp_enabled: false,
  //   two_factor_enabled: false,
  //   unsafe_metadata: {},
  //   updated_at: 1736679167865,
  //   username: null,
  //   verification_attempts_remaining: 100,
  //   web3_wallets: []
  // }


  if (evt.type === 'user.created') {
    infoLogger({ message: "New User Created, creating profile" })
    const user = evt.data
    const againCheck = {
      userId: user.id,
      email: user.email_addresses[0].email_address || "",
      name: user.fullName as string || "new user",
      verified: true,
      createdAt: new Date(user.created_at).toISOString(),
      updatedAt: new Date(user.created_at).toISOString(),
    }

    console.log("USER DTO", againCheck)

    const response = await userProfileStore.CreateProfile(againCheck)
    if (!response.success) {
      res.status(response.error.code).json(response.error)
      return response
    }
  }
  res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
  return {
    success: true,
    data: null
  }
};
