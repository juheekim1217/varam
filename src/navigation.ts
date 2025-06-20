import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
          text: 'About us',
          href: getPermalink('/about'),
        },
        {
          text: 'Team',
          href: getPermalink('/homes/startup'),
        },
        {
          text: 'Locations',
          href: getPermalink('/homes/startup'),
        },
        {
          text: 'Terms',
          href: getPermalink('/terms'),
        },
        {
          text: 'Privacy Policy',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Personal Training',
      links: [
        {
          text: 'Training Programs',
          href: getPermalink('/#features'),
        },
        {
          text: 'Trainers',
          href: getPermalink('/services'),
        },
        {
          text: 'Coming Soon',
          href: getPermalink('/landing/pre-launch'),
        },
        {
          text: 'Rates',
          href: getPermalink('/pricing'),
        },
      ],
    },
    {
      text: 'Booking',
      links: [
        {
          text: 'Booking',
          href: getPermalink('/landing/product'),
        },
        {
          text: 'Subscription',
          href: getPermalink('/landing/subscription'),
        },
      ],
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        // {
        //   text: 'Article',
        //   href: getPermalink('markdown-elements-demo-post', 'post'),
        // },
        // {
        //   text: 'Category Page',
        //   href: getPermalink('tutorials', 'category'),
        // },
        // {
        //   text: 'Tag Page',
        //   href: getPermalink('astro', 'tag'),
        // },
      ],
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Become a Member', href: '#registration', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'About',
      links: [
        { text: 'About Us', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Locations', href: '#' },
        { text: 'Terms', href: '#' },
        { text: 'Private Policy', href: '#' },
      ],
    }, {
      title: 'Personal Training',
      links: [
        { text: 'Training Programs', href: '#' },
        { text: 'Trainers', href: '#' },
        { text: 'Rates', href: '#' },
        { text: 'Comming Soon', href: '#' },
      ],
    }, {
      title: 'Booking',
      links: [
        { text: 'Booking', href: '#' },
        { text: 'Subscription', href: '#' },
      ],
    },
    {
      title: 'Blog',
      links: [
        { text: 'Blog', href: '#' },
        { text: 'Article', href: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: 'Contact', href: '#' },
      ],
    },
  ],
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
    © 2025 HYPERION TRAINING · All rights reserved.
  `,
};
