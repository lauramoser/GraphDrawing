/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.6.0.4.
 ** Copyright (c) 2000-2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
import type { Airport, Connection } from '../data-types'

export const flightData: { airports: Airport[]; connections: Connection[] } = {
  airports: [
    { name: 'Los Angeles', iata: 'LAX', lat: 33.942536, lng: -118.408075, passengers: 65000000 },
    { name: 'Rio de Janeiro', iata: 'GIG', lat: -22.808903, lng: -43.243647, passengers: 5000000 },
    { name: 'Lima', iata: 'LIM', lat: -12.021889, lng: -77.114319, passengers: 18000000 },
    { name: 'London', iata: 'LHR', lat: 51.4775, lng: -0.461389, passengers: 61000000 },
    { name: 'Frankfurt', iata: 'FRA', lat: 50.033333, lng: 8.570556, passengers: 48000000 },
    { name: 'Moscow', iata: 'SVO', lat: 55.972642, lng: 37.414589, passengers: 49000000 },
    { name: 'New Delhi', iata: 'DEL', lat: 28.5665, lng: 77.103089, passengers: 39000000 },
    { name: 'Shanghai', iata: 'PVG', lat: 31.143378, lng: 121.805214, passengers: 32000000 },
    { name: 'Hongkong', iata: 'HKG', lat: 22.308919, lng: 113.914603, passengers: 1000000 },
    { name: 'Tokio', iata: 'NRT', lat: 35.764722, lng: 140.386389, passengers: 15000000 },
    { name: 'Dubai', iata: 'DXB', lat: 25.252778, lng: 55.364444, passengers: 29000000 },
    { name: 'Dakar', iata: 'DKR', lat: 14.670833, lng: -17.072778, passengers: 2000000 },
    { name: 'Johannesburg', iata: 'JNB', lat: -26.133694, lng: 28.242317, passengers: 9000000 },
    { name: 'Sydney', iata: 'SYD', lat: -33.946111, lng: 151.177222, passengers: 44000000 },
    { name: 'Nairobi', iata: 'NBO', lat: -1.319167, lng: 36.927778, passengers: 900000 },
    { name: 'Atlanta', iata: 'ATL', lat: 33.639167, lng: -84.427778, passengers: 93000000 },
    { name: 'New York City', iata: 'JFK', lat: 40.63975, lng: -73.778925, passengers: 55000000 },
    { name: 'Cairo', iata: 'CAI', lat: 30.121944, lng: 31.405556, passengers: 14000000 },
    { name: 'Casablanca', iata: 'CMN', lat: 33.367467, lng: -7.589967, passengers: 7000000 },
    { name: 'Lagos', iata: 'LOS', lat: 6.577222, lng: 3.321111, passengers: 5000000 },
    { name: 'Cape Town', iata: 'CPT', lat: -33.969444, lng: 18.597222, passengers: 5000000 },
    { name: 'Chengdu', iata: 'CTU', lat: 30.578333, lng: 103.946944, passengers: 40000000 },
    { name: 'Jakarta', iata: 'CGK', lat: -6.125567, lng: 106.655897, passengers: 54000000 },
    { name: 'Teheran', iata: 'IKA', lat: 35.416111, lng: 51.152222, passengers: 8000000 },
    { name: 'Tel Aviv', iata: 'TLV', lat: 32.011389, lng: 34.886667, passengers: 20000000 },
    { name: 'Kuala Lumpur', iata: 'KUL', lat: 2.745578, lng: 101.709917, passengers: 25000000 },
    { name: 'Manila', iata: 'MNL', lat: 14.508647, lng: 121.019581, passengers: 8000000 },
    { name: 'Singapur', iata: 'SIN', lat: 1.350189, lng: 103.994433, passengers: 32000000 },
    { name: 'Taipeh', iata: 'TPE', lat: 25.077732, lng: 121.232822, passengers: 800000 },
    { name: 'Bangkok', iata: 'BKK', lat: 13.681108, lng: 100.747283, passengers: 65000000 },
    { name: 'Istanbul', iata: 'IST', lat: 40.976922, lng: 28.814606, passengers: 64000000 },
    { name: 'Ulaanbaatar', iata: 'ULN', lat: 47.843056, lng: 106.766639, passengers: 1000000 },
    { name: 'Melbourne', iata: 'MEL', lat: -37.673333, lng: 144.843333, passengers: 12000000 },
    { name: 'Brisbane', iata: 'BNE', lat: -27.383333, lng: 153.118056, passengers: 23000000 },
    { name: 'Nadi', iata: 'NAN', lat: -17.755392, lng: 177.443378, passengers: 2000000 },
    { name: 'Auckland', iata: 'AKL', lat: -37.008056, lng: 174.791667, passengers: 21000000 },
    { name: 'Paris', iata: 'CDG', lat: 49.009722, lng: 2.547778, passengers: 57000000 },
    { name: 'Madrid', iata: 'MAD', lat: 40.4675, lng: -3.551944, passengers: 50000000 },
    { name: 'Barcelona', iata: 'BCN', lat: 41.297078, lng: 2.078464, passengers: 41000000 },
    { name: 'Rome', iata: 'FCO', lat: 41.804444, lng: 12.250833, passengers: 29000000 },
    { name: 'Copenhagen', iata: 'CPH', lat: 55.617917, lng: 12.655972, passengers: 30000000 },
    { name: 'Helsinki', iata: 'HEL', lat: 60.317222, lng: 24.963333, passengers: 5000000 },
    { name: 'Athens', iata: 'ATH', lat: 37.936358, lng: 23.944467, passengers: 22000000 },
    { name: 'Dublin', iata: 'DUB', lat: 53.421333, lng: -6.270075, passengers: 32000000 },
    { name: 'Reykjavik', iata: 'RKV', lat: 64.13, lng: -21.940556, passengers: 400000 },
    { name: 'Oslo', iata: 'OSL', lat: 60.193917, lng: 11.100361, passengers: 9000000 },
    { name: 'Vienna', iata: 'VIE', lat: 48.110833, lng: 16.570833, passengers: 10000000 },
    { name: 'Lisbon', iata: 'LIS', lat: 38.774167, lng: -9.134167, passengers: 28000000 },
    { name: 'Stockholm', iata: 'ARN', lat: 59.651944, lng: 17.918611, passengers: 7000000 },
    { name: 'Edinburgh', iata: 'EDI', lat: 55.95, lng: -3.3725, passengers: 14000000 },
    { name: 'Chicago', iata: 'ORD', lat: 41.978603, lng: -87.904842, passengers: 54000000 },
    { name: 'Dallas', iata: 'DFW', lat: 32.896828, lng: -97.037997, passengers: 73000000 },
    { name: 'San Francisco', iata: 'SFO', lat: 37.618972, lng: -122.374889, passengers: 42000000 },
    { name: 'Las Vegas', iata: 'LAS', lat: 36.080056, lng: -115.15225, passengers: 52000000 },
    { name: 'Miami', iata: 'MIA', lat: 25.79325, lng: -80.290556, passengers: 50000000 },
    { name: 'Toronto', iata: 'YYZ', lat: 43.677222, lng: -79.630556, passengers: 12000000 },
    { name: 'Vancouver', iata: 'YVR', lat: 49.193889, lng: -123.184444, passengers: 19000000 },
    { name: 'Montreal', iata: 'YUL', lat: 45.47175, lng: -73.736569, passengers: 15000000 },
    { name: 'Mexico-City', iata: 'MEX', lat: 19.436303, lng: -99.072097, passengers: 46000000 },
    { name: 'Guatemala-City', iata: 'GUA', lat: 14.583272, lng: -90.527475, passengers: 2000000 },
    { name: 'Buenos Aires', iata: 'EZE', lat: -34.822222, lng: -58.535833, passengers: 5000000 },
    { name: 'Sao Paulo', iata: 'GRU', lat: -23.432075, lng: -46.469511, passengers: 34000000 },
    {
      name: 'Santiago de Chile',
      iata: 'SCL',
      lat: -33.392975,
      lng: -70.785803,
      passengers: 20000000
    },
    { name: 'Brasilia', iata: 'BSB', lat: -15.871111, lng: -47.918611, passengers: 13000000 },
    { name: 'Bogota', iata: 'BOG', lat: 4.701594, lng: -74.146947, passengers: 36000000 },
    { name: 'Caracas', iata: 'CCS', lat: 10.601194, lng: -66.991222, passengers: 8000000 }
  ],
  connections: [
    { from: 'LAX', to: 'JFK' },
    { from: 'JFK', to: 'GIG' },
    { from: 'JFK', to: 'LIM' },
    { from: 'JFK', to: 'LHR' },
    { from: 'GIG', to: 'FRA' },
    { from: 'LIM', to: 'GIG' },
    { from: 'FRA', to: 'JFK' },
    { from: 'LHR', to: 'FRA' },
    { from: 'FRA', to: 'SVO' },
    { from: 'FRA', to: 'DXB' },
    { from: 'SVO', to: 'DEL' },
    { from: 'SVO', to: 'PVG' },
    { from: 'DEL', to: 'HKG' },
    { from: 'PVG', to: 'HKG' },
    { from: 'PVG', to: 'NRT' },
    { from: 'HKG', to: 'SYD' },
    { from: 'NRT', to: 'SYD' },
    { from: 'DXB', to: 'SVO' },
    { from: 'DXB', to: 'DEL' },
    { from: 'DXB', to: 'DKR' },
    { from: 'DXB', to: 'JNB' },
    { from: 'JNB', to: 'LHR' },
    { from: 'JNB', to: 'DKR' },
    { from: 'SYD', to: 'DXB' },
    { from: 'NBO', to: 'JNB' },
    { from: 'NBO', to: 'DXB' },
    { from: 'ATL', to: 'JFK' },
    { from: 'LAX', to: 'ATL' },
    { from: 'ATL', to: 'LHR' },
    { from: 'ATL', to: 'LIM' },
    { from: 'SCL', to: 'LIM' },
    { from: 'EZE', to: 'SCL' },
    { from: 'SCL', to: 'GRU' },
    { from: 'GIG', to: 'EZE' },
    { from: 'GIG', to: 'GRU' },
    { from: 'BSB', to: 'GIG' },
    { from: 'SCL', to: 'BSB' },
    { from: 'LIM', to: 'BSB' },
    { from: 'BOG', to: 'BSB' },
    { from: 'CCS', to: 'BSB' },
    { from: 'BOG', to: 'GUA' },
    { from: 'CCS', to: 'MIA' },
    { from: 'GUA', to: 'MIA' },
    { from: 'GUA', to: 'MEX' },
    { from: 'MEX', to: 'LAX' },
    { from: 'MEX', to: 'LAX' },
    { from: 'LAX', to: 'SFO' },
    { from: 'SFO', to: 'YVR' },
    { from: 'LAX', to: 'LAS' },
    { from: 'LAX', to: 'DFW' },
    { from: 'LAX', to: 'ORD' },
    { from: 'SFO', to: 'LAS' },
    { from: 'DFW', to: 'ATL' },
    { from: 'ATL', to: 'YYZ' },
    { from: 'ORD', to: 'YYZ' },
    { from: 'YYZ', to: 'YUL' },
    { from: 'YYZ', to: 'JFK' },
    { from: 'YUL', to: 'JFK' },
    { from: 'JNB', to: 'CPT' },
    { from: 'LOS', to: 'DKR' },
    { from: 'NBO', to: 'LOS' },
    { from: 'DKR', to: 'CMN' },
    { from: 'DKR', to: 'CAI' },
    { from: 'NBO', to: 'CAI' },
    { from: 'DXB', to: 'CAI' },
    { from: 'IKA', to: 'DXB' },
    { from: 'IST', to: 'IKA' },
    { from: 'TLV', to: 'ATH' },
    { from: 'CAI', to: 'TLV' },
    { from: 'ATH', to: 'IST' },
    { from: 'FCO', to: 'ATH' },
    { from: 'LIS', to: 'LHR' },
    { from: 'LIS', to: 'MAD' },
    { from: 'MAD', to: 'BCN' },
    { from: 'CDG', to: 'LHR' },
    { from: 'DUB', to: 'LHR' },
    { from: 'EDI', to: 'LHR' },
    { from: 'CDG', to: 'BCN' },
    { from: 'BCN', to: 'FCO' },
    { from: 'VIE', to: 'IST' },
    { from: 'VIE', to: 'SVO' },
    { from: 'CMN', to: 'LIS' },
    { from: 'MAD', to: 'CMN' },
    { from: 'FRA', to: 'CPH' },
    { from: 'LHR', to: 'CPH' },
    { from: 'CPH', to: 'OSL' },
    { from: 'CPH', to: 'ARN' },
    { from: 'ARN', to: 'HEL' },
    { from: 'HEL', to: 'SVO' },
    { from: 'ULN', to: 'PVG' },
    { from: 'CTU', to: 'PVG' },
    { from: 'PVG', to: 'TPE' },
    { from: 'CTU', to: 'HKG' },
    { from: 'TPE', to: 'HKG' },
    { from: 'HKG', to: 'MNL' },
    { from: 'BKK', to: 'HKG' },
    { from: 'SIN', to: 'KUL' },
    { from: 'SIN', to: 'BKK' },
    { from: 'CGK', to: 'SIN' },
    { from: 'MNL', to: 'SIN' },
    { from: 'SIN', to: 'SYD' },
    { from: 'BNE', to: 'SYD' },
    { from: 'SYD', to: 'MEL' },
    { from: 'NAN', to: 'SYD' },
    { from: 'AKL', to: 'SYD' },
    { from: 'NAN', to: 'AKL' },
    { from: 'RKV', to: 'LHR' },
    { from: 'BCN', to: 'CDG' },
    { from: 'BCN', to: 'FRA' },
    { from: 'FCO', to: 'FRA' },
    { from: 'BOG', to: 'MEX' },
    { from: 'BOG', to: 'GRU' },
    { from: 'ATL', to: 'MIA' },
    { from: 'FRA', to: 'IST' },
    { from: 'IST', to: 'DEL' },
    { from: 'PVG', to: 'BKK' },
    { from: 'DEL', to: 'BKK' }
  ]
}
