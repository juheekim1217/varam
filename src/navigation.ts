import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      links: [
        {
          text: 'About Us',
          href: getPermalink('/about'),
        },
                {
          text: 'Impact',
          href: getPermalink('/impact'),
        },
        {
          text: 'Contact',
          href: getPermalink('/contact'),
        },
      ],
    },
    {
      text: 'Training',
      links: [
        {
          text: 'Personal Training',
          href: getPermalink('/services'),
        },
        {
          text: 'Rates',
          href: getPermalink('/pricing'),
        },
      ],
    },
    // {
    //   text: 'Members',
    //   links: [
    //     {
    //       text: 'Book A Session',
    //       href: getPermalink('/book'),
    //     },
    //     {
    //       text: 'My Classes',
    //       href: getPermalink('/my-classes'),
    //     },
    //   ],
    // },
  ],
  actions: [{ text: 'Start Trial', href: '/trial', target: '_blank' }], //{ text: 'Sign In', href: '/signin'}, 
};

export const footerData = {
  links: [/* ... */], // add your main links here
  socialLinks: [/* ... */], // add your social links here
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  footNote: `© 2025 VARAM STRENGTH · All rights reserved.`,
};
