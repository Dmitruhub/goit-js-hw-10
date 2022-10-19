import './css/styles.css';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function onInput(evt) {
  // debugger;
  let name = evt.target.value.trim();
  if (!name) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }

  let data = fetchCountries(name);

  data
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        const countryInfoData = data[0];
        countryInfo.innerHTML = `Flags : <img src="${
          countryInfoData.flags.png
        }"/><br/>Name : ${countryInfoData.name.common}<br/>
            Capital : ${countryInfoData.capital}<br/>Population: ${
          countryInfoData.population
        }<br/>Languages: ${Object.values(countryInfoData.languages)}`;
        countryList.innerHTML = '';
      } else {
        countryList.innerHTML = data
          .map(
            country => `<li class="country-list__item">
               <img class="country-icon" src="${country.flags.png}"/>
                <p class="country-name">${country.name.common}</p></li>`
          )
          .join('');
        countryInfo.innerHTML = '';
      }
    })
    .catch(err => {
      console.log('Oops, there is no country with that name');
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

const inputCountry = document.querySelector('#search-box');
inputCountry.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
