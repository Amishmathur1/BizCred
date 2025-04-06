import React from "react";
import { BentoGrid, BentoGridItem } from "~/components/BentoGrid";
import { TbCircleNumber1, TbCircleNumber2, TbCircleNumber3, TbCircleNumber4, TbCircleNumber5 } from "react-icons/tb";

function LandingBento() {
  return (
    <div className="w-full z-30 mb-10">
      <BentoGrid>
        {/* Top Row - 3 Boxes (1 col each) */}
        <BentoGridItem
          title={<span className="text-xl font-bold">Fast Integration</span>}
          description={
            <span className="text-lg">
              Seamlessly integrate BizCred with your existing CSV financial data in minutes. Our platform analyzes your business performance data to create transparent credit scores without complex onboarding processes.
            </span>
          }
          icon={<TbCircleNumber1 size={40} className="text-blue-500" />}
          className="md:col-span-1"
        />
        <BentoGridItem
          title={<span className="text-xl font-bold">Secure by Design</span>}
          description={
            <span className="text-lg">
              Our platform is built with enterprise-grade security to protect your data. All lending is tokenized on the blockchain, ensuring decentralized transactions with maximum protection and transparency for both borrowers and lenders.
            </span>
          }
          icon={<TbCircleNumber2 size={40} className="text-green-500" />}
          className="md:col-span-1"
        />
        <BentoGridItem
          title={<span className="text-xl font-bold">Developer Friendly</span>}
          description={
            <span className="text-lg">
              Built for developers, BizCred offers robust APIs and tools to enhance productivity. Easily integrate our AI-powered credit scoring system with your existing financial applications for comprehensive business assessment.
            </span>
          }
          icon={<TbCircleNumber3 size={40} className="text-yellow-500" />}
          className="md:col-span-1"
        />

        {/* Bottom Row - 2 Boxes (2 cols + 1 col) */}
        <BentoGridItem
          title={<span className="text-xl font-bold">Scalable Architecture</span>}
          description={
            <span className="text-lg">
              Designed to grow with your business, no matter the size or complexity. Our AI-driven credit assessment adapts to businesses of all sizes, from small local enterprises to major corporations seeking alternative funding sources.
            </span>
          }
          icon={<TbCircleNumber4 size={40} className="text-red-500" />}
          className="md:col-span-2"
        />
        <BentoGridItem
          title={<span className="text-xl font-bold">Global Reach</span>}
          description={
            <span className="text-lg">
              Deliver seamless experiences to customers worldwide with our global infrastructure. Connect businesses seeking capital with investors across borders through our transparent, AI-powered credit scoring and tokenized lending marketplace.
            </span>
          }
          icon={<TbCircleNumber5 size={40} className="text-purple-500" />}
          className="md:col-span-1"
        />
      </BentoGrid>
    </div>
  );
}

export default LandingBento;
