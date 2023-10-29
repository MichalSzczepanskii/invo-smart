export const invalidEmails = [
  'plainaddress', // Missing @ symbol
  '@missinglocalpart.com', // Missing local part
  'missingdomain@.com', // Missing domain
  'missingtld@domain.', // Missing top-level domain
  'invalid@@email.com', // Double @ symbols
  'invalid.email.com', // Dot not allowed in local part
  'invalid@.com', // Missing domain name
  'invalid@.com.', // Trailing dot in domain
  'invalid@com', // Missing dot before TLD
  'invalid@sub..domain.com', // Double dots in domain
  'invalid@domain_com', // Underscore not allowed in TLD
  'invalid@domain..com', // Double dots in domain
  'invalid@-domain.com', // Hyphen at the start of the domain
  'invalid@domain-.com', // Hyphen at the end of the domain
  'invalid@domain.com-', // Hyphen at the end of the local part
];
