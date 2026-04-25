import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.boats.loading;
const selectBoats = (state) => state.boats.boats;
const selectBoatDetail = (state) => state.boats.boatDetail;
const selectTypes = (state) => state.boats.types;
const selectModels = (state) => state.boats.models;
const selectCities = (state) => state.boats.cities;

const selectSearchDates = (state) => state.boats.searchDates;

const selectBoatData = createSelector(
    [selectLoading, selectBoats, selectBoatDetail, selectTypes, selectModels, selectCities, selectSearchDates],
    (loading, boats, boatDetail, types, models, cities, searchDates) => ({ loading, boats, boatDetail, types, models, cities, searchDates })
);

export default selectBoatData;