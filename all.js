
let vm = new Vue({
  el: "#app",
  data() {
    return {
      AQI_URL: `https://script.google.com/macros/s/AKfycbwykvqZyMotUmiGlwSKdPvQz24bHtmaOBAn4c2HDk-7WY0zg_EM/exec?url=http://opendata2.epa.gov.tw/AQI.json`,
      data_API: [],
      currentCounty: '新北市',
      selectedDistrictData: {},
      chartData: [
        { text: '良好', score: '0 ~ 50', className: 'level_A' },
        { text: '普通', score: '51 ~ 100', className: 'level_B' },
        { text: '對敏感族群不健康', score: '101 ~ 150', className: 'level_C' },
        { text: '不健康', score: '151 ~ 200', className: 'level_D' },
        { text: '非常不健康', score: '201 ~ 300', className: 'level_E' },
        { text: '高危害', score: '301 ~ 400', className: 'level_F' },
      ],
    }
  },
  methods: {
    AQIsituation(aqi) {
      let newVal = '';
      if (aqi > 0 && aqi <= 50) {
        newVal = 'level_A';
      } else if (aqi > 50 && aqi <= 100) {
        newVal = 'level_B';
      } else if (aqi > 100 && aqi <= 150) {
        newVal = 'level_C';
      } else if (aqi > 150 && aqi <= 200) {
        newVal = 'level_D';
      } else if (aqi > 200 && aqi <= 300) {
        newVal = 'level_E';
      } else if (aqi > 300 && aqi <= 400) {
        newVal = 'level_F';
      }
      !aqi ? newVal = 'font-s' : false;
      return newVal;
    },
    userSelectDistrick(areaData) {
      this.selectedDistrict = areaData.SiteName;
      this.selectedDistrictData = this.data_API.find((item, index) => {
        return item.SiteName === this.selectedDistrict;
      })
    },
    localSet(title, data) {
      localStorage.setItem(title, JSON.stringify(data));
    },
    localGet(title) {
      return JSON.parse(localStorage.getItem(title));
    },
    localStorageOrDefualt(title, defualtVal, dataName) {
      this.localGet(title) ? this[dataName] = this.localGet(title) : defualtVal;
    }
  },
  watch: {
    //有更改到currentCounty() 就把數值存進localStorage
    currentCounty() {
     this.localSet('_aa', this.currentCounty);
   },
   //有更改到selectedDistrictData() 就把數值存進localStorage
   selectedDistrictData() {
     this.localSet('_bb', this.selectedDistrictData);
   }
 },
  computed: {
    County() {
      // 把資料裡面的城市名字取出，回傳新的陣列
      const countyData = this.data_API.map((item) => {
        return item.County;
      })
      // 回傳的陣列中，只取第一個符合條件的物件，回傳新的陣列（沒有重複的城市名字）
      return countyData.filter(function (item, index, arr) {
        return arr.indexOf(item) === index;
      })
    },
    // 回傳County名字等於我選擇的名稱的物件之陣列
    replaceCounty() {
      return this.data_API.filter((item, index) => {
        return item.County == this.currentCounty;
      })
    },
    itemValue(){
      return[
        {zh:'臭氧',en:'O3 (ppb)',value:this.selectedDistrictData.O3},
        {zh:'懸浮微粒',en:'PM10 (μg/m³)',value:this.selectedDistrictData.PM10},
        {zh:'細懸浮微粒',en:'PM2.5 (μg/m³)',value:this.selectedDistrictData['PM2.5']},
        {zh:'一氧化氮',en:'CO (ppm)',value:this.selectedDistrictData.CO},
        {zh:'二氧化硫',en:'SO2 (ppb)',value:this.selectedDistrictData.SO2},
        {zh:'二氧化氮',en:'NO2 (ppb)',value:this.selectedDistrictData.NO2},
       ];    
    },
  },
  filters: {
    ifEmpty(val) {
      return !val ? '-' : val;
    }
  },
  mounted() {
    this.localStorageOrDefualt('_aa', '新北市', 'currentCounty');
    this.localStorageOrDefualt('_bb', {}, 'selectedDistrictData');
    
    fetch(this.AQI_URL)
      .then(res => res.json())
      .then(data => this.data_API = data);
  },
})