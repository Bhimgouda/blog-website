if (process.env.NODE_ENV !== "production") require("dotenv").config();
const mongoose = require("mongoose");
const Article = require("../models/article");
const Category = require("../models/category");
const Author = require("../models/author");
const convertToSlug = require("../utils/convertToSlug")

const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/blog-website";

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

const seedDB = async () => {


//  await Article.insertMany(articles)
  // await Article.deleteMany({});
  // await Author.deleteMany({});
  // await Category.deleteMany({});

  // const author = new Author({
  //   name: "Pragat Vyawahare",
  //   email: "vyawaharepragat@gmail.com",
  //   password: "blogwebsite123",
  //   articles: [],
  // });
  
  // const { _id: authorId } = await author.save();

  // const category = new Category({
  //   title: "web3",
  //   description: "All articles and guides related to web3",
  //   articles: [],
  // });

  // const { _id: categoryId } = await category.save();

  // const heroImages = [
  //   "https://miro.medium.com/max/828/0*19YkNq6MZsxRY60I",
  //   "https://miro.medium.com/max/640/1*bTl5Mu1_CDQ-iQAQ1uKgyA.png",
  //   "https://miro.medium.com/max/828/1*qb37P7F1P5yaZpcMRfxZDg.png",
  //   "https://miro.medium.com/max/828/1*v08yVa1EMIoNPim8wQOb1Q.png",
  //   "https://miro.medium.com/max/828/1*21naLir4yYv3T6Eyuk9KgQ.png",
  //   "https://miro.medium.com/max/828/1*pgTgoLoFWYcycU7R8i3S4g.png",
  // ];

  // for (let i = 0; i < 6; i++) {
  //   const article = new Article({
  //     title: "Stable Coin: Types, Benefits, and Everything You Need to Know",
  //     description: `A stablecoin is a cryptocurrency that functions similarly to other
  //       cryptocurrencies but differs in volatility.`,
  //     tagline: "An easy-to-understand guide on Stablecoin",
  //     author: authorId,
  //     category: categoryId,
  //     keywords: "web3 crypto",
  //     datePublished: "10/07/2022",
  //     heroImage: heroImages[i],
  //     content: `
  //       <p>
  //         A stablecoin is a cryptocurrency that functions similarly to other
  //         cryptocurrencies but differs in volatility. Unlike other cryptocurrencies,
  //         they promise stable value. Stablecoins are pegged to or backed by other
  //         currencies or commodities, such as the US dollar or gold, to maintain their
  //         stable value.
  //       </p>
  //       <h2>Why and when were stable coins invented?</h2>
  //       <p>
  //         Early adopters began to accept Bitcoin as a new payment standard due to its
  //         accessibility, convenience, speed, and security regardless of the location.
  //         The only problem was its notorious volatility. Even today the biggest
  //         cryptocurrencies like Bitcoin and Etherreum suffer wild swings of more than
  //         10% in just a couple of hours. Such volatility can be scary, especially for
  //         merchants who accept crypto payments. Just imagine the face of the person
  //         whose crypto payment plummeted moments after being received.
  //       </p>
  //       <p>
  //         To avoid such traumatic facial reactions, the first stablecoin, BitUSD, was
  //         introduced in 2014. It was released on the BitShare blockchain as a token by
  //         two eminent Blockchain leaders, Charles Hoskinson and Dan Larimer.
  //       </p>
  //       <h2>The Advancategoryes of Stablecoin</h2>
  //       <p>
  //         Since its inception in 2014, stablecoins have become an important aspect of
  //         people’s lives, which is visible given their massive market caps. The
  //         cumulative market cap of the top 10 stablecoins touched $160 billion in
  //         March 2022, according to Statista.
  //       </p>
  //       <ul>
  //         <li>
  //           <p>
  //             Powered by Blockchain- The only reason why Bitcoin’s growth is hindered
  //             as a medium for exchange is its wild volatility. Stablecoins solve this
  //             by incorporating Bitcoin’s essentials — a tamper-proof transaction
  //             ledger with no third-party involvement — while mirroring real-world
  //             currencies.
  //           </p>
  //         </li>
  //         <li>
  //           <p>
  //             Cross-border remittances- The whole world knows how cross-border
  //             remittance was a pain in the ass before the vogue of cryptocurrencies.
  //             Stablecoins made remittances even more doable with their stable value
  //             and other benefits of cryptocurrencies, such as security, speed, and
  //             transparency.
  //           </p>
  //         </li>
  //         <li>
  //           <p>
  //             Safe to invest- Unlike most cryptocurrencies, stablecoins are a safer
  //             investment as tangible world assets or financial instruments back them.
  //           </p>
  //         </li>
  //         <li>
  //           <p>
  //             Protection for traders- Stablecoin is the best option for traders to
  //             flip their crypto during turbulent market conditions. It is very
  //             convenient to convert cryptocurrencies like Bitcoin and Ethereum to
  //             Stablecoin compared to fiat conversions.
  //           </p>
  //         </li>
  //       </ul>
  //       <h2>Why do stablecoins need backing?</h2>
  //       <p>
  //         Since Stablecoins are not legal tender, there must be a reason to trust
  //         them. Hence, stablecoins are backed by different real-world commodities and
  //         currencies. By becoming entangled with or pegged to more established
  //         traditional investments, they boost market confidence. As a result, they are
  //         often the go-to option for institutional and retail investors. Based on what
  //         is used to back or collateralize a stablecoin, there are 4 types of a
  //         stablecoin.
  //       </p>
  //       <h2>4 different types of Stablecoins</h2>
  //       <p>Let’s learn about each of the stablecoin types in brief.</p>
      
  //       <h3>Fiat-Collatarized Stablecoin</h3>
  //       <p>
  //         Fiat-collatarized stablecoins are the most popular ones, backed by fiat
  //         currencies such as USD, EUR, or GBP at a 1:1 ratio, meaning each stablecoin
  //         can be exchanged for one unit of the fiat currency. This type of stablecoin
  //         maintains a reserve of one or multiple fiat currencies as collateral to
  //         maintain its peg. Companies that offer such stablecoins must ensure that the
  //         number of minted coins doesn’t exceed its fiat counterparts. i.e. If there
  //         are a total of 1 billion tokens in circulation, then the fiat reserve must
  //         also equal 1 billion. Tether, Gemini Dollar, and USDP are some examples of
  //         fiat-collateralized stablecoins.
  //       </p>
      
  //       <h3>Commodity-Collatarized Stablecoins</h3>
  //       <p>
  //         The commodity-collateralized Coins are backed or collateralized by valuable
  //         real-world commodities such as Gold, Platinum, Oil or even Real estate.
  //         Collateral or commodity used to back the stablecoin is often reserved in
  //         third-party vaults. Gold is the most common commodity used to back
  //         stablecoins, which has a proven track record of value appreciation. Some
  //         popular examples include Tether Gold (XAUT) and Paxos Gold (PAXG).
  //         Crypto-Collatarized Stablecoins A crypto-collateralized stablecoin is backed
  //         by other cryptocurrencies, as you’d have already guessed from the name.
  //         Since cryptocurrencies are highly volatile, a 1:1 ratio doesn’t work here:
  //         the reserved cryptocurrency for backing must be at least 2–3 times more than
  //         the stablecoin to maintain the peg. Examples include WBTC, Dai, and BitUSD,
  //         among others.
  //       </p>
      
  //       <h3>Algorithmic Stablecoins</h3>
  //       <p>
  //         In Algorithmic Stablecoins, Collateral is replaced by an Algorithm, unlike
  //         other collateral-based coins. This means the price stability of the coin
  //         pegged to any asset(could be fiat or gold) relies on algorithmic mechanisms
  //         instead of collateral such as currencies or commodities. The algorithm
  //         constantly works to maintain supply, i.e., if the price rises, the algorithm
  //         will modify itself to issue more coins, and if the price falls below the
  //         pegged value, the algorithm sells the coins. Some examples include Frax
  //         Ampleforth (AMPL), Kowala (kUSD) and Frax, etc.
  //       </p>
  //       <h2>Future of Stable Coins</h2>
  //       <p>
  //         It is evident that cryptocurrencies are here for the long haul. No matter
  //         how often punitive Governments tried to beat them down, the craze for them
  //         is unlikely to wane. Stablecoin, on the other hand, are cryptocurrencies
  //         that offer stability — a thing that the whole world craves. Stablecoins are
  //         something people genuinely need because of the benefits they bring to the
  //         table. TerraUST’s tumble is, ofcourse, a spiteful event and has caught a lot
  //         of regulatory attention. The US congress might even pass a legislation
  //         anytime soon to create a regulatory framework for stablecoins, as revealed
  //         by Janet Yellen . While a regulatory framework would address many of the
  //         issues preventing stable coin adoption, we can’t comment on what
  //         implications can come with it.
  //       </p>
  //     </article>`,
  //   });
  //   const { _id: articleId } = await article.save();
  // }

  console.log("Database Seeded Successfully");
  mongoose.disconnect();
};

seedDB();
