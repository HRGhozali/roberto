export interface SearchResults {
    id: string,
    fullName: string,
    email: string,
    accessName: string,
    active:boolean,
    session: number,
    createdBy: string,
    updatedBy: string,
    isList: boolean  // Ideally this will let me hide session, createdBy and updatedBy
}
