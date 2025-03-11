"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { supabase } from "../../lib/supabase"; // Import the initialized client
import introJs from "intro.js";

type Task = {
  id: number;
  name: string;
  content: string; // Add other fields as needed
  completed: boolean;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  ember_preferences: string;
};

const Carousel = ({ userProfile }: { userProfile: Profile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [cards, setCards] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userProfile) {
        return;
      }
      const { data, error } = await supabase
        .from("Tasks")
        .select("*")
        .in("Ember Type", userProfile.ember_preferences.split(","));
      console.log(data);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        const mappedData = data.map((el) => {
          return {
            id: el.id,
            name: el[`Ember Type`],
            content: el[`Task Instructions`],
            completed: false,
          };
        });
        // setCards(mappedData.slice(0, 3) as Task[]);
        if (mappedData.length < 4) {
          setCards(mappedData as Task[]);
        } else {
          const shuffleData = mappedData.sort(() => Math.random() - 0.5);
          setCards(shuffleData.slice(0, 3) as Task[]);
        }
      }
    };

    fetchTasks();
  }, [userProfile]);

  const handleComplete = (id: number) => {
    console.log(id);
    const modifiedCards = cards.map((card) => {
      if (card.id !== id) {
        return card;
      } else {
        return {
          ...card,
          completed: true,
        };
      }
    });

    setCards(modifiedCards);
  };

  // Move to next card
  const handleNext = () => {
    if (isTransitioning) return;

    // Handle transition from last to first card
    if (currentIndex === cards.length - 1) {
      setIsTransitioning(true);
      // First set to an intermediate position
      setCurrentIndex(cards.length);

      // After animation completes, reset to position 0 without animation
      setTimeout(() => {
        setSkipAnimation(true);
        setCurrentIndex(0);

        // Re-enable animations after the reset
        setTimeout(() => {
          setSkipAnimation(false);
          setIsTransitioning(false);
        }, 50);
      }, 700);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Move to previous card
  const handlePrev = () => {
    if (isTransitioning) return;

    // Handle transition from first to last card
    if (currentIndex === 0) {
      setIsTransitioning(true);
      // First set to an intermediate position
      setCurrentIndex(-1);

      // After animation completes, reset to position cards.length - 1 without animation
      setTimeout(() => {
        setSkipAnimation(true);
        setCurrentIndex(cards.length - 1);

        // Re-enable animations after the reset
        setTimeout(() => {
          setSkipAnimation(false);
          setIsTransitioning(false);
        }, 50);
      }, 700);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // starts intro tut with custom styling
  useEffect(() => {
    // Add the custom CSS for Intro.js
    const customCss = `
    /* Customized Intro.js CSS for Novari's green theme */
    .introjs-overlay {
      position: absolute;
      box-sizing: content-box;
      z-index: 999999;
      opacity: 0;
      transition: all .3s ease-out;
      background-color: rgba(121, 169, 135, 0.3); /* Light green overlay */
    }
    
    .introjs-showElement {
      z-index: 9999999 !important;
    }
    
    tr.introjs-showElement > td,
    tr.introjs-showElement > th {
      z-index: 9999999 !important;
      position: relative;
    }
    
    .introjs-disableInteraction {
      z-index: 99999999 !important;
      position: absolute;
      background-color: #fff;
      opacity: 0;
    }
    
    .introjs-relativePosition {
      position: relative;
    }
    
    .introjs-helperLayer {
      box-sizing: content-box;
      position: absolute;
      z-index: 9999998;
      border-radius: 12px; /* Rounded corners like the Novari UI */
      transition: all .3s ease-out;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(121, 169, 135, 0.1);
      box-shadow: 0 0 15px rgba(121, 169, 135, 0.);
      
    }
    
    .introjs-helperLayer *,
    .introjs-helperLayer :before,
    .introjs-helperLayer :after {
      box-sizing: content-box;
    }
    
    .introjs-tooltipReferenceLayer {
      font-family: "Helvetica Neue", Inter, ui-sans-serif, "Apple Color Emoji", Helvetica, Arial, sans-serif;
      box-sizing: content-box;
      position: absolute;
      visibility: hidden;
      z-index: 100000000;
      background-color: transparent;
      transition: all .3s ease-out;
    }
    
    .introjs-tooltipReferenceLayer * {
      font-family: "Helvetica Neue", Inter, ui-sans-serif, "Apple Color Emoji", Helvetica, Arial, sans-serif;
    }
    
    .introjs-helperNumberLayer {
      font-family: "Helvetica Neue", Inter, ui-sans-serif, "Apple Color Emoji", Helvetica, Arial, sans-serif;
      color: #4e7c59; /* Darker green to match Novari theme */
      text-align: center;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    
    /* Arrow styling */
    .introjs-arrow {
      border: 5px solid transparent;
      content: "";
      position: absolute;
    }
    
    .introjs-arrow.top,
    .introjs-arrow.top-right,
    .introjs-arrow.top-middle {
      border-bottom-color: #ffffff; /* White to match the tooltip background */
    }
    
    .introjs-arrow.right,
    .introjs-arrow.right-bottom {
      border-left-color: #ffffff;
    }
    
    .introjs-arrow.bottom,
    .introjs-arrow.bottom-right,
    .introjs-arrow.bottom-middle {
      border-top-color: #ffffff;
    }
    
    .introjs-arrow.left,
    .introjs-arrow.left-bottom {
      border-right-color: #ffffff;
    }
    
    /* Tooltip styling */
    .introjs-tooltip {
      box-sizing: content-box;
      position: absolute;
      visibility: visible;
      background-color: #ffffff; /* White background as requested */
      min-width: 250px;
      max-width: 300px;
      border-radius: 12px; /* Rounded corners like Novari UI */
      box-shadow: 0 3px 15px rgba(121, 169, 135, 0.3);
      transition: opacity .1s ease-out;
      border: 1px solid rgba(121, 169, 135, 0.3);
    }
    
    .introjs-tooltiptext {
      padding: 30px; /* Increased padding for more space around text */
      color: #4e7c59; /* Dark green text */
    }
    
    /* Tooltip header */
    .introjs-tooltip-title {
      font-size: 18px;
      width: 90%;
      min-height: 1.5em;
      margin: 0;
      padding: 0;
      font-weight: 700;
      line-height: 1.5;
      color: #4e7c59; /* Dark green text */
    }
    
    .introjs-tooltip-header {
      position: relative;
      padding-left: 25px;
      padding-right: 25px;
      padding-top: 15px;
      min-height: 1.5em;
    }
    
    /* Button styling */
    .introjs-tooltipbuttons {
      border-top: 1px solid rgba(121, 169, 135, 0.3);
      padding: 10px;
      text-align: right;
      white-space: nowrap;
    }
    
    .introjs-tooltipbuttons:after {
      content: "";
      visibility: hidden;
      display: block;
      height: 0;
      clear: both;
    }
    
    .introjs-button {
      box-sizing: content-box;
      position: relative;
      overflow: visible;
      padding: 0.5rem 1rem;
      border: 1px solid #79a987; /* Green border */
      text-decoration: none;
      text-shadow: none;
      font-size: 14px;
      color: #4e7c59; /* Dark green text */
      white-space: nowrap;
      cursor: pointer;
      outline: 0;
      background-color: #dcf0e2; /* Light green background */
      border-radius: 0.2em;
      zoom: 1;
      display: inline;
    }
    
    .introjs-button:hover {
      outline: 0;
      text-decoration: none;
      border-color: #4e7c59; /* Darker green border on hover */
      background-color: #c0e6cb; /* Slightly darker green background on hover */
      color: #3a5d43; /* Darker text on hover */
    }
    
    .introjs-button:focus {
      outline: 0;
      text-decoration: none;
      background-color: #c0e6cb;
      box-shadow: 0 0 0 .2rem rgba(121, 169, 135, 0.5);
      border: 1px solid #4e7c59;
      color: #3a5d43;
    }
    
    .introjs-button:active {
      outline: 0;
      text-decoration: none;
      background-color: #b1dfc0;
      border-color: #4e7c59;
      color: #3a5d43;
    }
    
    /* Skip button */
    .introjs-skipbutton {
      position: absolute;
      top: 8px; /* More space from the top */
      right: 40px; /* Moved further to the left by increasing right margin */
      display: inline-block;
      width: 30px; /* Smaller width */
      height: 30px; /* Smaller height */
      line-height: 30px; /* Adjust line height to match new height */
      color: #4e7c59; /* Dark green */
      font-size: 16px; /* Smaller font size */
      cursor: pointer;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      opacity: 50%
    }
    
    .introjs-skipbutton:hover,
    .introjs-skipbutton:focus {
      color: #3a5d43; /* Darker green on hover */
      outline: 0;
      text-decoration: none;
    }
    
    /* Next/prev buttons */
    .introjs-prevbutton {
      float: left;
    }
    
    .introjs-nextbutton {
      float: right;
    }
    
    /* Disabled button */
    .introjs-disabled {
      color: #a6c9b1; /* Light green */
      border-color: #c0e6cb;
      box-shadow: none;
      cursor: default;
      background-color: #e9f7ed;
      background-image: none;
      text-decoration: none;
    }
    
    .introjs-disabled:hover,
    .introjs-disabled:focus {
      color: #a6c9b1;
      border-color: #c0e6cb;
      box-shadow: none;
      cursor: default;
      background-color: #e9f7ed;
      background-image: none;
      text-decoration: none;
    }
    
    /* Progress bar */
    .introjs-progress {
      box-sizing: content-box;
      overflow: hidden;
      height: 10px;
      margin: 10px;
      border-radius: 4px;
      background-color: #e9f7ed; /* Very light green */
    }
    
    .introjs-progressbar {
      box-sizing: content-box;
      float: left;
      width: 0%;
      height: 100%;
      font-size: 10px;
      line-height: 10px;
      text-align: center;
      background-color: #4e7c59; /* Dark green */
    }
    
    /* Hint styling */
    .introjs-hint {
      box-sizing: content-box;
      position: absolute;
      background: 0 0;
      width: 20px;
      height: 15px;
      cursor: pointer;
    }
    
    .introjs-hint-pulse {
      box-sizing: content-box;
      width: 15px;
      height: 15px;
      border-radius: 30px;
      background-color: rgba(121, 169, 135, 0.4); /* Green pulse */
      z-index: 10;
      position: absolute;
      transition: all .2s ease-out;
      animation: introjspulse 2s infinite;
    }
    
    @keyframes introjspulse {
      0% {
        transform: scale(.95);
        box-shadow: 0 0 0 0 rgba(121, 169, 135, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px transparent;
      }
      100% {
        transform: scale(.95);
        box-shadow: 0 0 0 0 transparent;
      }
    }
    `;

    // Create a style element and insert the custom CSS
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(customCss));
    document.head.appendChild(styleElement);

    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: document.getElementById("hero") as HTMLElement,
          intro: "This is where your tasks are located.",
          position: "top",
        },

        {
          element: document.getElementById("prevBtn") as HTMLElement,
          intro: "Use this button to navigate to the previous task.",
          position: "left",
        },
        {
          element: document.getElementById("nextBtn") as HTMLElement,
          intro: "Click here to move to the next task!",
          position: "right",
        },
      ],
      showProgress: true,
      nextLabel: "Next",
      prevLabel: "Back",
      skipLabel: "Skip",
    });

    // Add a timeout to ensure DOM elements are fully rendered before starting the tutorial
    setTimeout(() => {
      // Check if elements exist before starting the tutorial
      const heroElement = document.getElementById("hero");
      const prevBtnElement = document.getElementById("prevBtn");
      const nextBtnElement = document.getElementById("nextBtn");

      if (heroElement && prevBtnElement && nextBtnElement) {
        intro.start();
      } else {
        console.error("Required DOM elements for tutorial not found:", {
          hero: !!heroElement,
          prevBtn: !!prevBtnElement,
          nextBtn: !!nextBtnElement,
        });
      }
    }, 1000); // 2 second delay

    // Clean up the style element when the component unmounts
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []); // the tut only runs on mount
  console.log(cards);

  return (
    <div className="pb-40 w-full flex flex-col items-center justify-center bg-custom-green overflow-hidden">
      <div id="hero" className="relative w-full h-96 perspective">
        {/* Carousel container */}
        <div
          className={`absolute w-full h-full ${
            skipAnimation ? "" : "transition-transform duration-700 ease-out"
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${currentIndex * -120}deg)`,
          }}
        >
          {/* Generate all cards */}
          {cards.map((card, index) => {
            const radius = 265; // Distance from center - cards are closer together
            const isActive = index === currentIndex % cards.length;

            return (
              <div
                key={index}
                className={`absolute top-0 left-0 right-0 mx-auto w-80 h-100 rounded-full shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  card.completed
                    ? "bg-radial from-emerald-700 from-40% to-emerald-900"
                    : "bg-radial from-green-200 from-40% to-custom-green text-gray-600"
                }`}
                style={{
                  transform: `rotateY(${
                    index * 120
                  }deg) translateZ(${radius}px)`,
                  opacity: isActive ? 1 : 0.2, // Active card has full opacity, others slightly dimmed
                }}
              >
                <div>
                  <h2 className="text-2xl font-bold pt-25 text-center mb-3">
                    {card["name"]}
                  </h2>
                  <p className="text-center">{card.content}</p>
                </div>
                <button
                  id={isActive ? "complete" : ""}
                  onClick={() => handleComplete(card.id)}
                  disabled={card.completed}
                  className={`mt-4 py-3 px-6 rounded-lg self-center transition-all duration-300 
                    ${
                      card.completed
                        ? "bg-green-100 text-green-800 cursor-not-allowed"
                        : "bg-emerald-700 hover:bg-emerald-800 text-custom-white"
                    } font-semibold flex items-center gap-2`}
                >
                  {card.completed ? (
                    <>
                      <Check className="text-green-600" size={20} />
                      <span>Completed</span>
                    </>
                  ) : (
                    "Complete"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="mt-12 flex gap-6">
        <button
          id="prevBtn"
          onClick={handlePrev}
          disabled={isTransitioning}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 py-2 px-6 rounded-xl transition-colors text-2xl"
        >
          ←
        </button>
        <button
          id="nextBtn"
          onClick={handleNext}
          disabled={isTransitioning}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 py-2 px-6 rounded-xl transition-colors text-2xl"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Carousel;
