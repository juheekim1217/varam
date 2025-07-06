import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      links: [
        {
          text: 'About Us',
          href: getPermalink('/about/about'),
        },
        {
          text: 'Impact',
          href: getPermalink('/about/impact'),
        },
        {
          text: 'Contact',
          href: getPermalink('/forms/contact'),
        },
      ],
    },
    {
      text: 'Training',
      links: [
        {
          text: 'Personal Training',
          href: getPermalink('/training/services'),
        },
        {
          text: 'Rates',
          href: getPermalink('/training/pricing'),
        },
      ],
    },
  ],

  actions: [{ text: 'Start Trial', href: '/forms/trial', target: '_blank' }],
};

export const footerData = {
  links: [
    /* ... */
  ], // add your main links here
  socialLinks: [
    /* ... */
  ], // add your social links here
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  footNote: `© 2025 VARAM STRENGTH · All rights reserved.`,
};
