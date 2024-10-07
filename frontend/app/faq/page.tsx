"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

const faqs = [
  {
    question: "What is SellScaleHood?",
    answer: "SellScaleHood is a simplified stock trading application that allows you to search for stock tickers, buy and sell stocks, and manage your portfolio."
  }, 
  {
    question: "How do I buy or sell stocks?",
    answer: "Navigate to the 'Search' page to find stocks you are interested in. You can buy stocks from there. To sell stocks, go to your 'Portfolio' page and click on the 'Sell' button next to the stock you wish to sell."
  },
  {
    question: "How do I use the Portfolio page?",
    answer: "The Portfolio page displays all the stocks you currently own. You can view your holdings, current values, and profit/loss for each stock. You can also buy more or sell your existing stocks from this page."
  },
  {
    question: "What is the Trending page?",
    answer: "The Trending page shows a list of popular stocks that are currently trending in the market. You can view their current prices and price changes, and quickly buy these stocks if you're interested."
  },
  {
    question: "How do I search for a specific stock?",
    answer: "Use the 'Search' page to look up specific stocks. Type in the stock symbol or company name, and select from the autocomplete results. You can then view detailed information about the stock and choose to buy it."
  }
];

export default function FAQPage() {
  return (
    <div className="w-full min-h-screen topography-background">
      <div className="max-w-3xl mx-auto pt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal">
          Frequently Asked Questions
        </h1>
        <Accordion defaultExpandedKeys={["0"]}>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              aria-label={faq.question}
              title={faq.question}
              className="faq-accordion-item relative"
            >
              <div className="faq-accordion-content">
                <p className="text-foreground">{faq.answer}</p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
