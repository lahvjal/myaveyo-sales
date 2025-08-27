'use client'

import React from 'react'
import Button from '@/components/Button'
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation'

const careerCards = [
    {
        number: "1",
        title: "The Team That Has Your Back",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        number: "2",
        title: "Training That Works in the Real World",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        number: "3",
        title: "Rewards That Actually Motivate",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        number: "4",
        title: "A Clear Path to the Top",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
]

export default function BuildCareers() {
    // Animation hooks
    const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200 })
    const descriptionAnimation = useScrollAnimation<HTMLParagraphElement>({ delay: 400 })
    const cardAnimations = useStaggeredScrollAnimation<HTMLDivElement>(careerCards.length, 600, 200)
    const forestImageAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1400 })
    const buttonAnimation = useScrollAnimation<HTMLDivElement>({ delay: 1600 })

    return (
        <section className="relative bg-[#0d0d0d] py-20 flex flex-col">
            <div className="flex flex-col items-center justify-center gap-[90px] max-w-[1480px] mx-auto">

                {/* Header Section */}
                <div className="text-left pl-[25%]">
                    <div 
                        ref={headerAnimation.ref}
                        className={`flex gap-[30px] pl-[50px] transition-all duration-700 ${
                            headerAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`}
                    >
                        <p className="text-[#666666] text-[11px] tracking-[4.4px] uppercase mb-6 font-telegraf">(5)</p>
                        <h2 className="text-white text-[64px] font-black uppercase leading-[58px] mb-8 font-telegraf">
                            HOW WE BUILD CAREERS
                        </h2>
                    </div>
                    <p 
                        ref={descriptionAnimation.ref}
                        className={`text-[#999999] text-[20px] w-full leading-relaxed font-telegraf pl-[50px] transition-all duration-700 ${
                            descriptionAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`}
                    >
                        SEE HOW AVEYO MIXES OPPORTUNITY, MENTORSHIP, AND
                        INCENTIVES TO HELP YOU EARN MORE, TRAVEL MORE, AND LIVE
                        THE LIFE YOU'VE BEEN CHASING.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-[20px]">
                    {/* 4 Cards in Horizontal Layout */}
                    <div className="flex justify-between gap-[20px] w-full">
                        {careerCards.map((card, index) => (
                            <div
                                key={index}
                                ref={cardAnimations[index].ref}
                                className={`flex h-[170px] p-[20px] gap-[40px] flex-row justify-space-between items-center align-middle rounded-[3px] transition-all duration-700 ${
                                    cardAnimations[index].isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                                }`}
                                style={{ backgroundColor: 'rgba(26, 27, 28, 0.40)' }}
                            >
                                {/* Card Image */}
                                <div className="relative h-full w-[140px] overflow-hidden rounded-[2px]">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                {/* Card Content */}
                                <div className="text-left w-full">
                                    <div className="text-[#888888] text-[14px] mb-2 font-telegraf">
                                        {card.number} -
                                    </div>
                                    <h3 className="text-white text-[16px] font-bold leading-tight font-telegraf group-hover:text-[#00ff88] transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Large Tree Background Image Section */}
                    <div 
                        ref={forestImageAnimation.ref}
                        className={`relative h-[700px] overflow-hidden w-full rounded-[3px] transition-all duration-700 ${
                            forestImageAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url('/images/forest-aveyo.png')`
                            }}
                        />

                        {/* Dark Overlay */}
                        {/* <div className="absolute inset-0 bg-black/60" /> */}

                    </div>
                </div>
                {/* CTA Button */}
                <div 
                    ref={buttonAnimation.ref}
                    className={`transition-all duration-700 ${
                        buttonAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                >
                    <Button variant="primary">
                        JOIN THE TEAM
                    </Button>
                </div>
            </div>
        </section>
    )
}
