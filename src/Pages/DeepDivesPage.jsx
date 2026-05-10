import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import "./DeepDivesPage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function DeepDivesPage() {
  const navigate = useNavigate();
  const [isIndexLoading, setIsIndexLoading] = useState(false);
  const [deepDiveIndex, setDeepDiveIndex] = useState([]);
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  function scrollCards(direction) {
  scrollRef.current?.scrollBy({
    left: direction === "left" ? -360 : 360,
    behavior: "smooth",
  });
  }

  useEffect(() => {
    function checkOverflow() {
      const el = scrollRef.current;
      if (!el) return;

      setShowArrows(el.scrollWidth > el.clientWidth);
    }

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [deepDiveIndex]);

  useEffect(() => {
    async function loadDeepDiveIndex() {
      setIsIndexLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/deepdives`
        );

        if (!response.ok) {
          throw new Error("Could not load deep dives.");
        }

        const data = await response.json();
        setDeepDiveIndex(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsIndexLoading(false);
      }
    }

    loadDeepDiveIndex();
  }, []);

  if (isIndexLoading) {
    return <p className="timeline-index__loading">Loading deep dives...</p>;
  }

  return (
    <><Header isMapActive={false} />
    <section className="timeline-index">
      <div className="timeline-index__header">
        <p className="timeline-index__eyebrow">Explore history</p>
        <h1>Choose a timeline</h1>
        <p>Pick a topic and dive into its major events, maps, and slides.</p>
      </div>

      <div className="timeline-carousel">
        {showArrows && (
          <button
            className="timeline-carousel__arrow timeline-carousel__arrow--left"
            type="button"
            onClick={() => scrollCards("left")}
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <div className="timeline-index__grid" ref={scrollRef}>
          {deepDiveIndex.map((item) => (
            <button
              key={item.id}
              className="timeline-card"
              type="button"
              onClick={() => navigate(`/deepdives/${item.id}`)}
            >
              <div className="timeline-card__image-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="timeline-card__image"
                />
              </div>

              <div className="timeline-card__content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className="timeline-card__start">Start timeline →</span>
              </div>
            </button>
          ))}
        </div>

        {showArrows && (
          <button
            className="timeline-carousel__arrow timeline-carousel__arrow--right"
            type="button"
            onClick={() => scrollCards("right")}
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>
    </section></>
  );
}