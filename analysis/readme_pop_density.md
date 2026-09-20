# Population density - Data package

This data package contains the data that powers the chart ["Population density"](https://ourworldindata.org/grapher/population-density?v=1&csvType=full&useColumnShortNames=false) on the Our World in Data website. It was downloaded on September 20, 2026.

### Active Filters

A filtered subset of the full data was downloaded. The following filters were applied:

## CSV structure

Each row is an observation for an entity (usually a country or region) at a timepoint.

- "Entity" — the name of the entity, e.g. "United States".
- "Code" — our internal entity code. For most countries this is the [ISO alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code, e.g. "USA"; historical and other non-standard entities get a custom code.
- "Year" or "Day" — the timepoint. Annual data has a "Year" column holding an integer year; otherwise a "Day" column holds a date string in the form "YYYY-MM-DD".
- The final column is the data column — the time series that powers the chart. Downloaded with the "full data" option it corresponds to the time series below; with "only selected data visible in the chart" it is transformed depending on the chart type, so the correspondence may be less direct.


## Metadata.json structure

The .metadata.json file contains metadata about the data package. The "charts" key contains information to recreate the chart, like the title, subtitle etc. The "columns" key contains information about each of the columns in the csv, like the unit, timespan covered, citation for the data etc.

## How we process data at Our World in Data

Our World in Data is almost never the original producer of the data - almost all of the data we use has been compiled by others. If you want to re-use data, it is your responsibility to ensure that you adhere to the sources' license and to credit them correctly. Please note that a single time series may have more than one source - e.g. when we stitch together data from different time periods by different producers or when we calculate per capita metrics using population data from a second source.

Preparing this data involves several processing steps. Depending on the data, this can include standardizing country names and world region definitions, converting units, calculating derived indicators such as per capita measures, as well as adding or adapting metadata such as the name or the description given to an indicator.
[Read about our data pipeline](https://docs.owid.io/projects/etl/).

## Detailed information about the data


### Population density
Population per square kilometer by country, available from 10,000 BCE to 2100, based on data and estimates from different sources.

Last updated: July 15, 2024  
Next expected update: December 2026  
Date range: 10000 BCE – 2100 CE  
Unit: people per km²  
Source: HYDE (2023); Gapminder (2022); UN WPP (2024); UN FAO (2024) – with major processing by Our World in Data  

#### How to cite this data

HYDE (2023); Gapminder (2022); UN WPP (2024); UN FAO (2024) – with major processing by Our World in Data

#### Notes on our processing step for this indicator
We have estimated the population density by using population estimates from multiple sources and land area estimates by the Food and Agriculture Organization of the United Nations.

We obtain it by dividing the population estimates by the land area estimates.

### Combination of different sources
We construct our long-run population data by combining multiple sources:

- 10,000 BCE–1799: historical estimates by HYDE (v3.3).

- 1800–1949: historical estimates by Gapminder (v7).

- 1950–2023: population records from the United Nations World Population Prospects (2024 revision).

- 2024-2100: Projections based on Medium variant by the UN World Population Prospects (2024 revision).

**Geographical aggregates**

- For most years, we calculate aggregates by summing the population of member countries.
- We do this based on [our definition of continents](https://ourworldindata.org/world-region-map-definitions#our-world-in-data) and the [World Bank’s income groups](https://ourworldindata.org/grapher/world-bank-income-groups).
- The only exception is before 1800, where we use HYDE's estimates for continents (but not income groups).

For most of the years, we've estimated regional aggregates by summing the population of countries in each region. We've relied on [our continents](https://ourworldindata.org/world-region-map-definitions#our-world-in-data) and [World Bank income group definitions](https://ourworldindata.org/grapher/world-bank-income-groups). The only exception is before 1800, where we've used HYDE's estimates on continents (but not income groups).

**World**
- Before 1800: we use data from HYDE.
- 1800-1950: we estimate the global population by summing all available countries in the dataset.
- After 1950, we rely on estimates from the United Nations World Population Prospects.


## Sources

These are the sources behind the data in this package. Each time series above names the ones it draws on in its citation.

### PBL Netherlands Environmental Assessment Agency – History Database of the Global Environment

This database presents an update and expansion of the History Database of the Global Environment (HYDE, v 3.3) and replaces former HYDE 3.2 version from 2017. HYDE is and internally consistent combination of updated historical population estimates and land use. Categories include cropland, with a new distinction into irrigated and rain fed crops (other than rice) and irrigated and rain fed rice. Also grazing lands are provided, divided into more intensively used pasture, converted rangeland and non-converted natural (less intensively used) rangeland. Population is represented by maps of total, urban, rural population and population density as well as built-up area. The period covered is 10 000 BCE to 2023 CE. Spatial resolution is 5 arc minutes (approx. 85 km2 at the equator), the files are in ESRI ASCII grid format.

Producer: PBL Netherlands Environmental Assessment Agency  
Published: 2023-11-30  
Retrieved on: 2024-01-02  
Retrieved from: https://doi.org/10.24416/UU01-AEZZIT  
Direct download: https://geo.public.data.uu.nl/vault-hyde/HYDE%203.3%5B1701183392%5D/original/hyde33_c7_base_mrt2023/txt/all_indicators.zip  
License: CC BY 4.0 (https://doi.org/10.24416/UU01-AEZZIT)  

Citation: Utrecht University/PBL Netherlands Environmental Assessment Agency – History Database of the Global Environment (HYDE v 3.3, 2023).
Klein Goldewijk, C.G.M., Beusen, A., Doelman, J., Stehfest, E., 2017, Anthropogenic land use estimates for the Holocene – HYDE 3.2, Earth Syst. Sci. Data, 9, 927–953

### Gapminder – Population

Gapminder's population data is divided into two chunks: One long historical trend for the global population that goes back to 10,000 BC. And the second chunk is country estimates that only reaches back to 1800.

For the first chunk, several sources were used. You can learn more at https://docs.google.com/spreadsheets/d/1hkLbEilJbl630IG68q-aQJlUjuTFm9b_12nQMVd1sZM/edit#gid=0. For the second chunk, Gapminder uses UN population data between 1950 to 2100 from the UN Population Division World Population Prospects 2019, and the forecast to the year 2100 uses their medium-fertility variant.

For years before 1950, this version uses the data documented in greater detail by Mattias Lindgren in version 3. The main source was Angus Maddison's data, which CLIO Infra Project maintained and improved. Note that when combining version 3 with the new UN data, the trends for a few countries didn't match up in the overlapping year 1950.

Minor adjustments were made to the years before and after to smooth out discrepancies between the two sources and avoid spurious jumps in Gapminder's visualizations.

Visit https://www.gapminder.org/data/documentation/gd003/ to learn more about the methodology used and the data from back to 10,000 BC.

Producer: Gapminder  
Published: 2022-10-19  
Retrieved on: 2023-03-31  
Retrieved from: http://gapm.io/dpop  
Direct download: https://gapm.io/dl_popv7  
License: CC BY 4.0 (https://docs.google.com/document/d/1-RmthhS2EPMK_HIpnPctcXpB0n7ADSWnXa5Hb3PxNq4/edit?usp=sharing)  

Citation: Gapminder Population v7 (2022)

### United Nations – World Population Prospects

World Population Prospects 2024 is the 28th edition of the official estimates and projections of the global population that have been published by the United Nations since 1951. The estimates are based on all available sources of data on population size and levels of fertility, mortality and international migration for 237 countries or areas. If you have questions about this dataset, please refer to [their FAQ](https://population.un.org/wpp/faqs). You can also explore [data sources](https://population.un.org/wpp/data-sources) for each country or visit [their main page](https://population.un.org/wpp/) for more details.

Producer: United Nations  
Published: 2024-07-11  
Retrieved on: 2024-07-11  
Retrieved from: https://population.un.org/wpp/downloads/  
Direct download: https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_PopulationBySingleAgeSex_Medium_1950-2023.csv.gz  
License: CC BY 3.0 IGO (https://population.un.org/wpp/downloads/)  

Citation: United Nations, Department of Economic and Social Affairs, Population Division (2024). World Population Prospects 2024, Online Edition.

### United Nations – World Population Prospects – Interim Update

World Population Prospects 2024 is the 28th edition of the official estimates and projections of the global population that have been published by the United Nations since 1951. The estimates are based on all available sources of data on population size and levels of fertility, mortality and international migration for 237 countries or areas. If you have questions about this dataset, please refer to [their FAQ](https://population.un.org/wpp/faqs). You can also explore [data sources](https://population.un.org/wpp/data-sources) for each country or visit [their main page](https://population.un.org/wpp/) for more details.

This is an interim update containing revised medium-variant estimates and projections for Togo.

Producer: United Nations  
Published: 2026-01-19  
Retrieved on: 2026-03-31  
Retrieved from: https://population.un.org/wpp/downloads/  
Direct download: https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/WPP2024_CSV_files_update.zip  
License: CC BY 3.0 IGO (https://population.un.org/wpp/downloads/)  

Citation: United Nations, Department of Economic and Social Affairs, Population Division (2024). World Population Prospects 2024, Online Edition.

### Gapminder – Systema Globalis

Data by Gapminder on population and other indicators. It provides data on former countries and regions.

Producer: Gapminder  
Published: 2023-02-21  
Retrieved on: 2023-03-31  
Retrieved from: https://github.com/open-numbers/ddf--gapminder--systema_globalis  
License: CC BY 4.0 (https://github.com/open-numbers/ddf--gapminder--systema_globalis)  

Citation: Gapminder – Systema Globalis (2023)

### Food and Agriculture Organization of the United Nations – Land, Inputs and Sustainability: Land Use

The FAOSTAT Land Use domain contains data on forty-four categories of land use, irrigation and agricultural practices and five indicators relevant to monitor agriculture, forestry and fisheries activities at national, regional and global level.

Data are available by country and year, with global coverage and annual updates.

Producer: Food and Agriculture Organization of the United Nations  
Published: 2024-02-15  
Retrieved on: 2024-03-14  
Retrieved from: http://www.fao.org/faostat/en/#data/RL  
Direct download: https://fenixservices.fao.org/faostat/static/bulkdownloads/Inputs_LandUse_E_All_Data_(Normalized).zip  
License: CC BY-NC-SA 3.0 IGO (http://www.fao.org/contact-us/terms/db-terms-of-use/en)  

Citation: Food and Agriculture Organization of the United Nations – Land, Inputs and Sustainability: Land Use (2024).

    