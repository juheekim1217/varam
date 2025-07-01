import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    // {
    //   text: 'Homes',
    //   links: [
    //     {
    //       text: 'SaaS',
    //       href: getPermalink('/homes/saas'),
    //     },
    //     {
    //       text: 'Startup',
    //       href: getPermalink('/homes/startup'),
    //     },
    //     {
    //       text: 'Mobile App',
    //       href: getPermalink('/homes/mobile-app'),
    //     },
    //     {
    //       text: 'Personal',
    //       href: getPermalink('/homes/personal'),
    //     },
    //   ],
    // },
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
        // {
        //   text: 'Coming Soon',
        //   href: getPermalink('/landing/pre-launch'),
        // },
        {
          text: 'Rates',
          href: getPermalink('/pricing'),
        },
      ],
    },
    {
      text: 'Members',
      links: [
        {
          text: 'Book A Session',
          href: getPermalink('/book'),
        },
        {
          text: 'My Classes',
          href: getPermalink('/my-classes'),
        },
      ],
    },
    // {
    //   text: 'Blog',
    //   links: [
    //     {
    //       text: 'Blog',
    //       href: getBlogPermalink(),
    //     },
    //     {
    //       text: 'Training Insights by Omer',
    //       href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
    //     },
    //   ],
    // },
  ],
  actions: [{ text: 'Sign In', href: '/login', target: '_blank', variant: 'link' }, { text: 'Start Trial', href: '/trial', target: '_blank' }],
};

export const footerData = {
  // links: [
  //   {
  //     title: 'About',
  //     links: [
  //       { text: 'About Us', href: '#' },
  //       { text: 'Team', href: '#' },
  //       { text: 'Contact', href: '#' },
  //       { text: 'Locations', href: '#' },
  //     ],
  //   }, {
  //     title: 'Personal Training',
  //     links: [
  //       { text: 'Training Programs', href: '#' },
  //       { text: 'Trainers', href: '#' },
  //       { text: 'Rates', href: '#' },
  //       { text: 'Coming Soon', href: '#' },
  //     ],
  //   }, {
  //     title: 'Booking',
  //     links: [
  //       { text: 'Booking', href: '#' },
  //       { text: 'Subscription', href: '#' },
  //     ],
  //   },
  //   {
  //     title: 'Blog',
  //     links: [
  //       { text: 'Blog', href: '#' },
  //       { text: 'Training Insights by Omer', href: '#' },
  //     ],
  //   },
  // ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  // socialLinks: [
  //   { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
  //   { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
  //   { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
  //   { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  //   { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  // ],
  footNote: `
    © 2025 VARAM STRENGTH · All rights reserved.
  `,
};
