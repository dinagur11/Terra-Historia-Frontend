import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, GitBranch } from "lucide-react";
import { useNavigate, useLocation} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";
import Header from "../Components/Header/Header";
import { isDeepDiveAvailable } from "../constants/deepDiveAvailability";
import { getDeepDiveImage } from "../constants/deepDiveImages";
import {
  CONFLICT_GRAPH_NODES,
  CONFLICT_GRAPH_SIZE,
  CONFLICT_RELATIONSHIPS,
  CONFLICT_RELATIONSHIP_TYPES,
} from "../constants/deepDiveRelationships";
import "./DeepDivesPage.css";

function getConnectionPath(from, to) {
  const startX = from.x + CONFLICT_GRAPH_SIZE.nodeWidth;
  const startY = from.y + CONFLICT_GRAPH_SIZE.nodeHeight / 2;
  const endX = to.x;
  const endY = to.y + CONFLICT_GRAPH_SIZE.nodeHeight / 2;
  const curve = Math.max(70, (endX - startX) * 0.48);

  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${
    endX - curve
  } ${endY}, ${endX} ${endY}`;
}

export default function DeepDivesPage() {
  const navigate = useNavigate();
  const [isIndexLoading, setIsIndexLoading] = useState(false);
  const [deepDiveIndex, setDeepDiveIndex] = useState([]);
  const [activeId, setActiveId] = useState("wwi-events");
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const graphScrollRef = useRef(null);
  const { isLogged } = useAuth();
  const [completedTimelines, setCompletedTimelines] = useState(new Set());

  const location = useLocation();

  useEffect(() => {
    if (location.state?.justCompleted) {
      setCompletedTimelines((prev) => new Set([...prev, location.state.justCompleted]));
    }
  }, [location.state?.justCompleted]);
  
  useEffect(() => {
    async function loadDeepDiveIndex() {
      setIsIndexLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deepdives`);
        if (!response.ok) throw new Error("Could not load deep dives.");

        const data = await response.json();
        setDeepDiveIndex(data.filter((item) => isDeepDiveAvailable(item.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsIndexLoading(false);
      }
    }

    loadDeepDiveIndex();
  }, []);

  useEffect(() => {
    async function loadProgress() {
      if (!isLogged) return;
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) return;
        const data = await response.json();
        const completed = Object.keys(data.timelineProgress || {}).filter(
          (k) => data.timelineProgress[k]
        );
        setCompletedTimelines(new Set(completed));
      } catch (err) {
        console.error(err);
      }
    }
    loadProgress();
  }, [isLogged]);

  const divesById = useMemo(
    () => Object.fromEntries(deepDiveIndex.map((item) => [item.id, item])),
    [deepDiveIndex]
  );

  const connectedIds = useMemo(() => {
    const ids = new Set([activeId]);
    CONFLICT_RELATIONSHIPS.forEach(({ from, to }) => {
      if (from === activeId) ids.add(to);
      if (to === activeId) ids.add(from);
    });
    return ids;
  }, [activeId]);

  const activeRelationships = CONFLICT_RELATIONSHIPS.filter(
    ({ from, to }) => from === activeId || to === activeId
  );

  if (isIndexLoading) {
    return <p className="timeline-index__loading">Loading deep dives...</p>;
  }

  return (
    <>
      <Header isMapActive={false} />
      <main className={`conflict-page ${isHeaderCompact ? "is-compact" : ""}`}>
        <header className="conflict-page__header">
          <div>
            <p className="conflict-page__eyebrow">
              <GitBranch size={15} />
              Explore the forces that shaped the history of Europe, Israel and the USA.
            </p>
            <h1>Dive into the wars that shaped our modern world.</h1>
            <p>
              Explore the conflicts that transformed borders, alliances, and
              global power. Select any war to discover the events that shaped
              it and the conflicts that followed.
            </p>
          </div>

          <div className="conflict-legend" aria-label="Connection legend">
            {Object.entries(CONFLICT_RELATIONSHIP_TYPES).map(([id, type]) => (
              <span key={id}>
                <i style={{ background: type.color }} />
                {type.label}
              </span>
            ))}
          </div>
        </header>

        <section className="conflict-graph-shell">
          <div className="conflict-graph-hint">
            Scroll sideways and down to explore
          </div>

          <div
            ref={graphScrollRef}
            className="conflict-graph-scroll"
            onScroll={(event) => {
              const shouldCompact = event.currentTarget.scrollTop > 70;
              setIsHeaderCompact((current) =>
                current === shouldCompact ? current : shouldCompact
              );
            }}
          >
            <div
              className="conflict-graph"
              style={{
                width: CONFLICT_GRAPH_SIZE.width,
                height: CONFLICT_GRAPH_SIZE.height,
              }}
            >
              <div className="conflict-graph__era conflict-graph__era--one">
                1914
              </div>
              <div className="conflict-graph__era conflict-graph__era--two">
                1945
              </div>
              <div className="conflict-graph__era conflict-graph__era--three">
                Cold War
              </div>
              <div className="conflict-graph__era conflict-graph__era--four">
                1980s
              </div>

              <svg
                className="conflict-connections"
                width={CONFLICT_GRAPH_SIZE.width}
                height={CONFLICT_GRAPH_SIZE.height}
                aria-hidden="true"
              >
                {CONFLICT_RELATIONSHIPS.map((relationship) => {
                  const from = CONFLICT_GRAPH_NODES[relationship.from];
                  const to = CONFLICT_GRAPH_NODES[relationship.to];
                  const type = CONFLICT_RELATIONSHIP_TYPES[relationship.type];
                  const isActive =
                    relationship.from === activeId ||
                    relationship.to === activeId;

                  return (
                    <path
                      key={`${relationship.from}-${relationship.to}`}
                      d={getConnectionPath(from, to)}
                      className={isActive ? "is-active" : ""}
                      style={{ "--connection-color": type.color }}
                    />
                  );
                })}
              </svg>

              {Object.entries(CONFLICT_GRAPH_NODES).map(([nodeId, node]) => {
                const item = divesById[nodeId];
                if (!item) return null;

                const isActive = nodeId === activeId;
                const isConnected = connectedIds.has(nodeId);

                return (
                  <button
                    key={nodeId}
                    className={`conflict-node ${node.root ? "is-root" : ""} ${
                      node.major ? "is-major" : ""
                    } ${isActive ? "is-active" : ""} ${
                      isConnected ? "is-connected" : "is-muted"
                    } ${completedTimelines.has(nodeId) ? "is-completed" : ""}`}
                    style={{ left: node.x, top: node.y }}
                    type="button"
                    onMouseEnter={() => setActiveId(nodeId)}
                    onFocus={() => setActiveId(nodeId)}
                    onClick={() => navigate(`/deepdives/${nodeId}`)}
                  >
                    <img src={getDeepDiveImage(item)} alt="" />
                    <span className="conflict-node__shade" />
                    {completedTimelines.has(nodeId) && (
                      <span className="conflict-node__completed-badge" aria-label="Completed">✓</span>
                    )}
                    <span className="conflict-node__copy">
                      <small>{node.years}</small>
                      <strong>{item.title}</strong>
                      <em>Open deep dive <ArrowRight size={13} /></em>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="conflict-detail">
          <div>
            <p>Selected conflict</p>
            <h2>{divesById[activeId]?.title || "World War I"}</h2>
          </div>
          <div className="conflict-detail__connections">
            {activeRelationships.map((relationship) => {
              const otherId =
                relationship.from === activeId
                  ? relationship.to
                  : relationship.from;
              const type = CONFLICT_RELATIONSHIP_TYPES[relationship.type];

              return (
                <button
                  key={`${relationship.from}-${relationship.to}`}
                  type="button"
                  onClick={() => setActiveId(otherId)}
                >
                  <i style={{ background: type.color }} />
                  <span>
                    <strong>{divesById[otherId]?.title || otherId}</strong>
                    <small>{relationship.label}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="conflict-mobile-list">
          {deepDiveIndex.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/deepdives/${item.id}`)}
            >
              <img src={getDeepDiveImage(item)} alt="" />
              <span>
                <small>{CONFLICT_GRAPH_NODES[item.id]?.years}</small>
                <strong>{item.title}</strong>
              </span>
              <ArrowRight size={18} />
            </button>
          ))}
        </section>
      </main>
    </>
  );
}
