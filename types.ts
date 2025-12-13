export interface GeneratedImage {
  id: string;
  url: string;
}

export enum AspectRatio {
  Square = "1:1",
  Portrait = "9:16",
  Landscape = "16:9"
}

export enum ConceptCategory {
  Noel = "Noel",
  Tet = "Tet",
  DuXuan = "DuXuan",
  SumVay = "SumVay",
  MuaDong = "MuaDong"
}

export interface ConceptItem {
  id: string;
  label: string; // Display name in Vietnamese
  prompt: string; // The prompt suffix
}

export interface CameraAngle {
  id: string;
  label: string;
  prompt: string;
}

export interface AppState {
  sourceImage: File | null;
  refImages: File[];
  isSourceFaceLock: boolean;
  isRefFaceLock: boolean;
  selectedCategory: ConceptCategory;
  selectedConceptId: string;
  selectedAngleId: string;
  selectedRatio: AspectRatio;
  additionalDetails: string;
  isGenerating: boolean;
  results: GeneratedImage[];
}