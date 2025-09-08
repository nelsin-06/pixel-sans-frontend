import freefireImage from "@/assets/freefire-post.jpg";
import robloxImage from "@/assets/roblox-post.jpg";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Free Fire MAX: Get 10,000 Free Diamonds - December 2024",
    excerpt: "Unlock exclusive Free Fire MAX diamond codes and claim your rewards instantly. Limited time offer for all players!",
    content: `
      <h2>Exclusive Free Fire MAX Diamond Codes</h2>
      <p>Get ready to claim your free diamonds in Free Fire MAX! We've compiled the latest working codes for December 2024 that will help you unlock exclusive rewards, including diamonds, skins, and more.</p>
      
      <h3>Active Codes for Today:</h3>
      <ul>
        <li><strong>FFMAX2024DEC</strong> - 1000 Diamonds</li>
        <li><strong>WINTERREWARDS</strong> - 500 Diamonds + Winter Skin</li>
        <li><strong>MAXPOWER2024</strong> - 2000 Diamonds</li>
        <li><strong>LEGENDARYFF</strong> - Premium Crate</li>
      </ul>
      
      <h3>How to Redeem:</h3>
      <ol>
        <li>Visit the official Free Fire rewards website</li>
        <li>Login with your Free Fire account</li>
        <li>Enter the code in the redemption box</li>
        <li>Click confirm and check your in-game mail</li>
      </ol>
      
      <p>Remember, these codes are time-limited and can expire at any moment. Make sure to redeem them as soon as possible!</p>
    `,
    image: freefireImage,
    category: "Free Fire",
    date: "December 10, 2024",
    readTime: "3 min read",
    author: "GamingPro",
    tags: ["Free Fire", "Diamonds", "Codes", "2024"],
  },
  {
    id: "2",
    title: "Roblox: 5000 Free Robux Generator - Working Methods 2024",
    excerpt: "Discover legitimate ways to earn free Robux in Roblox. No scams, just proven methods that actually work!",
    content: `
      <h2>Legitimate Ways to Get Free Robux</h2>
      <p>While there's no "generator" that magically creates Robux, there are legitimate ways to earn them for free. Here's our comprehensive guide.</p>
      
      <h3>Method 1: Microsoft Rewards</h3>
      <p>Earn points through Microsoft Rewards and redeem them for Robux gift cards. This is completely legitimate and supported by Microsoft.</p>
      
      <h3>Method 2: Roblox Affiliate Program</h3>
      <p>Share game links and earn Robux when new players sign up and make purchases through your links.</p>
      
      <h3>Method 3: Creating and Selling Items</h3>
      <p>Design clothes, accessories, or game passes and sell them on the Roblox marketplace.</p>
      
      <h3>Current Promo Codes:</h3>
      <ul>
        <li><strong>SPIDERCOLA</strong> - Spider Cola Shoulder Pet</li>
        <li><strong>TWEETROBLOX</strong> - The Bird Says</li>
      </ul>
      
      <p>Stay tuned for more legitimate ways to earn Robux!</p>
    `,
    image: robloxImage,
    category: "Roblox",
    date: "December 10, 2024",
    readTime: "5 min read",
    author: "RobloxMaster",
    tags: ["Roblox", "Robux", "Free", "Guide"],
  },
  {
    id: "3",
    title: "Valorant: New Agent Leaked - Abilities and Release Date",
    excerpt: "Exclusive leak reveals the next Valorant agent's abilities, ultimate, and expected release date. Get ready for Season 8!",
    content: `
      <h2>Breaking: New Valorant Agent Details</h2>
      <p>Sources close to Riot Games have revealed exciting details about the upcoming Agent set to join the Valorant roster in Episode 8.</p>
      
      <h3>Agent Abilities:</h3>
      <ul>
        <li><strong>Q - Shadow Strike:</strong> Teleport behind enemies within 15m range</li>
        <li><strong>E - Void Shield:</strong> Deploy a protective barrier that absorbs damage</li>
        <li><strong>C - Darkness Orb:</strong> Throw an orb that creates a smoke screen</li>
        <li><strong>X - Ultimate:</strong> Become invisible for 10 seconds with increased movement speed</li>
      </ul>
      
      <h3>Release Date</h3>
      <p>Expected to launch with Episode 8 Act 1 on January 15, 2024.</p>
      
      <h3>Early Access</h3>
      <p>Players who complete the upcoming battle pass will get early access to the new agent.</p>
    `,
    image: "https://picsum.photos/seed/valorant1/800/450",
    category: "Valorant",
    date: "December 9, 2024",
    readTime: "4 min read",
    author: "ValorantPro",
    tags: ["Valorant", "Agent", "Leak", "Season 8"],
  },
  {
    id: "4",
    title: "Brawl Stars: Unlimited Gems Glitch Found - Act Fast!",
    excerpt: "Players discover a new method to get unlimited gems in Brawl Stars. This glitch won't last long!",
    content: `
      <h2>Brawl Stars Gem Rewards Guide</h2>
      <p>While there's no actual "glitch" for unlimited gems, here are the best legitimate ways to maximize your gem earnings in Brawl Stars.</p>
      
      <h3>Daily Rewards</h3>
      <p>Complete daily quests and seasonal challenges for guaranteed gem rewards.</p>
      
      <h3>Brawl Pass Benefits</h3>
      <p>The Brawl Pass offers the best value for gems, with up to 90 gems in rewards.</p>
      
      <h3>Special Events</h3>
      <p>Participate in special events and championships for exclusive gem rewards.</p>
      
      <h3>Current Codes:</h3>
      <ul>
        <li><strong>BRAWL2024</strong> - 50 Gems</li>
        <li><strong>SUPERCELL</strong> - Mega Box + 30 Gems</li>
      </ul>
    `,
    image: "https://picsum.photos/seed/brawlstars1/800/450",
    category: "Brawl Stars",
    date: "December 9, 2024",
    readTime: "3 min read",
    author: "BrawlMaster",
    tags: ["Brawl Stars", "Gems", "Guide", "Tips"],
  },
  {
    id: "5",
    title: "GTA 6: Everything We Know So Far - Release Date Confirmed",
    excerpt: "Rockstar finally reveals GTA 6 release date, setting, and first gameplay details. The wait is almost over!",
    content: `
      <h2>GTA 6: Official Announcement</h2>
      <p>After years of speculation, Rockstar Games has finally shared concrete details about Grand Theft Auto VI.</p>
      
      <h3>Release Date</h3>
      <p>GTA 6 is officially set to launch in Fall 2025 for PlayStation 5 and Xbox Series X/S.</p>
      
      <h3>Setting</h3>
      <p>Return to Vice City in a modern-day setting with an expanded map including surrounding areas.</p>
      
      <h3>Main Characters</h3>
      <p>Play as two protagonists, including the series' first female lead character.</p>
      
      <h3>New Features</h3>
      <ul>
        <li>Revolutionary weather system with hurricanes</li>
        <li>Expanded online world supporting 100+ players</li>
        <li>Cross-platform play confirmed</li>
      </ul>
    `,
    image: "https://picsum.photos/seed/gta6/800/450",
    category: "News",
    date: "December 8, 2024",
    readTime: "6 min read",
    author: "GameNews",
    tags: ["GTA 6", "Rockstar", "Release", "News"],
  },
  {
    id: "6",
    title: "Mobile Legends: Free Diamonds Event - Limited Time Only",
    excerpt: "Mobile Legends launches massive diamond giveaway event. Claim up to 5000 diamonds before it ends!",
    content: `
      <h2>Mobile Legends Diamond Event</h2>
      <p>The biggest diamond giveaway event of 2024 is here! Follow these steps to claim your rewards.</p>
      
      <h3>Event Period</h3>
      <p>December 10-17, 2024</p>
      
      <h3>How to Participate:</h3>
      <ol>
        <li>Login daily for 7 consecutive days</li>
        <li>Complete special event tasks</li>
        <li>Share the event with friends for bonus diamonds</li>
      </ol>
      
      <h3>Rewards:</h3>
      <ul>
        <li>Day 1-3: 100 Diamonds each day</li>
        <li>Day 4-6: 500 Diamonds each day</li>
        <li>Day 7: 2000 Diamonds + Epic Skin</li>
      </ul>
    `,
    image: "https://picsum.photos/seed/mobilelegends1/800/450",
    category: "Diamonds",
    date: "December 8, 2024",
    readTime: "3 min read",
    author: "MLBBPro",
    tags: ["Mobile Legends", "Diamonds", "Event", "Free"],
  },
];