import relationshipData from "./deepDiveRelationships.json";

const VERTICAL_SPACING_SCALE = 1.22;

export const CONFLICT_GRAPH_SIZE = {
  ...relationshipData.size,
  height: Math.ceil(relationshipData.size.height * VERTICAL_SPACING_SCALE),
};
export const CONFLICT_RELATIONSHIP_TYPES = relationshipData.types;
export const CONFLICT_GRAPH_NODES = Object.fromEntries(
  Object.entries(relationshipData.nodes).map(([id, node]) => [
    id,
    {
      ...node,
      y: Math.round(node.y * VERTICAL_SPACING_SCALE),
    },
  ])
);
export const CONFLICT_RELATIONSHIPS = relationshipData.relationships;
