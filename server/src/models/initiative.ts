export interface TrackItem {
    id: string;
    name: string;
    value: number;
}

export interface IntitiativeTrack {
    current?: string;
    track: TrackItem[];
}
