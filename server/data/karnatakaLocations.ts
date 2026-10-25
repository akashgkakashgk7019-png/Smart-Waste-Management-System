export interface CityOrTown {
  name: string;
  wards: string[];
}

export interface HobliData {
  name: string;
  cities: CityOrTown[];
}

export interface TalukData {
  name: string;
  hoblis?: HobliData[];
  cities: CityOrTown[];
}

export interface DistrictData {
  name: string;
  taluks: TalukData[];
}

export const ALL_31_KARNATAKA_DISTRICTS: DistrictData[] = [
  {
    name: 'Bagalkote',
    taluks: [
      {
        name: 'Bagalkote Taluk',
        hoblis: [
          { name: 'Kasaba Hobli', cities: [{ name: 'Bagalkote CMC', wards: ['Ward 1 - Kaulpet', 'Ward 5 - Navanagar Sector 1', 'Ward 12 - Navanagar Sector 25', 'Ward 18 - Station Road'] }] },
          { name: 'Kaladagi Hobli', cities: [{ name: 'Kaladagi Town', wards: ['Bazaar Ward', 'Gram Panchayat Ward', 'Hospital Ward'] }] }
        ],
        cities: [{ name: 'Bagalkote City', wards: ['Navanagar Sector 1', 'Navanagar Sector 25', 'Vidyagiri', 'Old Bagalkote'] }]
      },
      {
        name: 'Badami Taluk',
        hoblis: [
          { name: 'Badami Kasaba', cities: [{ name: 'Badami TMC', wards: ['Ward 1 - Cave Temple Area', 'Ward 4 - Agastya Teertha', 'Ward 9 - Station Area'] }] },
          { name: 'Kerur Hobli', cities: [{ name: 'Kerur Town', wards: ['Main Bazaar Ward', 'Fort Ward', 'APMC Ward'] }] }
        ],
        cities: [{ name: 'Badami Town', wards: ['Cave Temple Ward', 'Station Road Ward', 'Fort Ward'] }]
      },
      {
        name: 'Jamkhandi Taluk',
        hoblis: [
          { name: 'Jamkhandi Kasaba', cities: [{ name: 'Jamkhandi CMC', wards: ['Ward 2 - Palace Road', 'Ward 8 - Girish Nagar', 'Ward 14 - Kadasiddeshwar Colony'] }] },
          { name: 'Savalgi Hobli', cities: [{ name: 'Savalgi', wards: ['Main Ward', 'Gram Chowk'] }] }
        ],
        cities: [{ name: 'Jamkhandi Town', wards: ['Palace Ward', 'Girish Nagar Ward', 'Boloor Ward'] }]
      },
      {
        name: 'Mudhol Taluk',
        hoblis: [
          { name: 'Mudhol Kasaba', cities: [{ name: 'Mudhol TMC', wards: ['Ward 3 - Ranna Nagar', 'Ward 7 - Ghataprabha Bank', 'Ward 11 - Market Yard'] }] },
          { name: 'Lokapur Hobli', cities: [{ name: 'Lokapur Town', wards: ['Lime Industry Ward', 'Main Circle Ward'] }] }
        ],
        cities: [{ name: 'Mudhol City', wards: ['Ranna Ward', 'Market Ward', 'Industrial Ward'] }]
      },
      {
        name: 'Hungund Taluk',
        cities: [{ name: 'Hungund TMC', wards: ['Ward 1 - Fort Road', 'Ward 5 - Bus Stand Area', 'Ward 8 - Sangameshwara Colony'] }]
      },
      {
        name: 'Ilkal Taluk',
        cities: [{ name: 'Ilkal CMC', wards: ['Ward 2 - Saree Weaver Colony', 'Ward 6 - Granite Market', 'Ward 10 - Kanthi Circle'] }]
      },
      {
        name: 'Bilagi Taluk',
        cities: [{ name: 'Bilagi TP', wards: ['Ward 1 - Siddeshwar Temple', 'Ward 4 - Court Road', 'Ward 7 - Krishna River Road'] }]
      },
      {
        name: 'Guledgudda Taluk',
        cities: [{ name: 'Guledgudda TMC', wards: ['Ward 1 - Chola Colony', 'Ward 5 - Handloom Colony', 'Ward 9 - Ganj Market'] }]
      },
      {
        name: 'Rabkavi Banhatti Taluk',
        cities: [{ name: 'Rabkavi Banhatti CMC', wards: ['Ward 3 - Weaver Street', 'Ward 8 - Somwarpet', 'Ward 15 - Banhatti Main Road'] }]
      }
    ]
  },
  {
    name: 'Ballari',
    taluks: [
      {
        name: 'Ballari City & Taluk',
        hoblis: [
          {
            name: 'Ballari Kasaba',
            cities: [
              {
                name: 'Ballari City Corporation (BCC)',
                wards: [
                  'Ward 4 - Brucepet',
                  'Ward 9 - Cowl Bazaar',
                  'Ward 14 - Gandhinagar',
                  'Ward 21 - Millerpet',
                  'Ward 28 - Fort Area',
                  'Ward 35 - Cantonment'
                ]
              }
            ]
          },
          { name: 'Kolur Hobli', cities: [{ name: 'Kolur', wards: ['Ward 1 - Grama Panchayat', 'Ward 2 - Raita Samparka'] }] }
        ],
        cities: [{ name: 'Ballari Municipal Corporation', wards: ['Brucepet', 'Cowl Bazaar', 'Gandhinagar', 'Millerpet', 'Fort Area'] }]
      },
      {
        name: 'Kampli Taluk',
        cities: [{ name: 'Kampli TMC', wards: ['Ward 1 - Fort Ward', 'Ward 4 - Sugar Mill Area', 'Ward 8 - Tungabhadra River Bank'] }]
      },
      {
        name: 'Kurugodu Taluk',
        cities: [{ name: 'Kurugodu TMC', wards: ['Ward 1 - Doddabasaveshwara Temple', 'Ward 5 - APMC Market', 'Ward 9 - Bus Stand'] }]
      },
      {
        name: 'Sanduru Taluk',
        cities: [{ name: 'Sanduru TMC', wards: ['Ward 2 - Palace Road', 'Ward 6 - Mining Colony', 'Ward 11 - Narihalla Dam Area'] }]
      },
      {
        name: 'Siruguppa Taluk',
        cities: [{ name: 'Siruguppa TMC', wards: ['Ward 1 - Rice Mill Area', 'Ward 5 - Tungabhadra Road', 'Ward 10 - Court Circle'] }]
      }
    ]
  },
  {
    name: 'Belagavi',
    taluks: [
      {
        name: 'Belagavi Taluk',
        hoblis: [
          {
            name: 'Belagavi Kasaba',
            cities: [
              {
                name: 'Belagavi City Corporation',
                wards: [
                  'Ward 1 - Camp',
                  'Ward 8 - Tilakwadi',
                  'Ward 15 - Shahapur',
                  'Ward 22 - Vadgaon',
                  'Ward 31 - Khasbag',
                  'Ward 40 - Angol',
                  'Ward 48 - RPD Corner'
                ]
              }
            ]
          },
          { name: 'Kakati Hobli', cities: [{ name: 'Kakati Industrial Area', wards: ['Industrial Estate Ward', 'Highway Ward'] }] },
          { name: 'Uchagaon Hobli', cities: [{ name: 'Uchagaon', wards: ['Grama Ward 1', 'Grama Ward 2'] }] }
        ],
        cities: [{ name: 'Belagavi Corporation', wards: ['Camp', 'Tilakwadi', 'Shahapur', 'Vadgaon', 'Angol', 'Hindwadi'] }]
      },
      {
        name: 'Gokak Taluk',
        cities: [{ name: 'Gokak CMC', wards: ['Ward 1 - Falls Road', 'Ward 6 - Mills Area', 'Ward 12 - Loli Bazaar', 'Ward 18 - Ghataprabha Ward'] }]
      },
      {
        name: 'Chikkodi Taluk',
        cities: [{ name: 'Chikkodi TMC', wards: ['Ward 2 - Court Road', 'Ward 7 - Basaveshwar Circle', 'Ward 13 - Guruwar Peth'] }]
      },
      {
        name: 'Athani Taluk',
        cities: [{ name: 'Athani TMC', wards: ['Ward 1 - Siddeshwar Temple', 'Ward 5 - Sugar Factory Road', 'Ward 11 - Mahaveer Circle'] }]
      },
      {
        name: 'Bailhongal Taluk',
        cities: [{ name: 'Bailhongal TMC', wards: ['Ward 1 - Kittur Rani Channamma Samadhi', 'Ward 6 - Cotton Market', 'Ward 10 - Old Town'] }]
      },
      {
        name: 'Hukkeri Taluk',
        cities: [{ name: 'Hukkeri TP', wards: ['Ward 2 - Fort Ward', 'Ward 5 - Rural Electric Cooperative', 'Ward 8 - Bazaar Road'] }]
      },
      {
        name: 'Khanapur Taluk',
        cities: [{ name: 'Khanapur TP', wards: ['Ward 1 - Malaprabha River Ward', 'Ward 4 - Railway Station', 'Ward 7 - Forest Colony'] }]
      },
      {
        name: 'Nippani Taluk',
        cities: [{ name: 'Nippani CMC', wards: ['Ward 1 - Tobacco Market', 'Ward 6 - Shivaji Chowk', 'Ward 14 - Ashoka Nagar'] }]
      },
      {
        name: 'Ramdurg Taluk',
        cities: [{ name: 'Ramdurg TMC', wards: ['Ward 2 - Malaprabha Bank', 'Ward 6 - Palace Area', 'Ward 11 - Ganeshpeth'] }]
      },
      {
        name: 'Raybag Taluk',
        cities: [{ name: 'Raybag TP', wards: ['Ward 1 - Railway Colony', 'Ward 4 - APMC Yard', 'Ward 8 - Mahaveer Nagar'] }]
      },
      {
        name: 'Savadatti Taluk',
        cities: [{ name: 'Savadatti TMC', wards: ['Ward 1 - Renuka Yellamma Hill Approach', 'Ward 5 - Fort Road', 'Ward 9 - Bus Stand Area'] }]
      },
      {
        name: 'Kittur Taluk',
        cities: [{ name: 'Kittur TP', wards: ['Ward 1 - Channamma Fort', 'Ward 3 - Museum Road', 'Ward 6 - National Highway Cross'] }]
      }
    ]
  },
  {
    name: 'Bengaluru Urban',
    taluks: [
      {
        name: 'Bengaluru North',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'BBMP North Zone',
                wards: [
                  'Ward 1 - Kempegowda Ward (Yelahanka)',
                  'Ward 2 - Chowdeshwari',
                  'Ward 8 - Kodigehalli',
                  'Ward 18 - Radhakrishna Temple',
                  'Ward 35 - Aramane Nagar (Sadashivanagar)',
                  'Ward 45 - Malleshwaram'
                ]
              }
            ]
          },
          {
            name: 'Yelahanka Hobli',
            cities: [
              {
                name: 'Yelahanka Satellite Town',
                wards: ['Ward 3 - Attur', 'Ward 4 - Yelahanka Satellite Town', 'Ward 5 - Kogilu']
              }
            ]
          }
        ],
        cities: [
          {
            name: 'BBMP North Zone',
            wards: ['Ward 1 - Kempegowda Ward', 'Ward 8 - Kodigehalli', 'Ward 18 - Radhakrishna Temple', 'Ward 45 - Malleshwaram']
          }
        ]
      },
      {
        name: 'Bengaluru South',
        hoblis: [
          {
            name: 'Begur Hobli',
            cities: [
              {
                name: 'BBMP South Zone',
                wards: [
                  'Ward 151 - Koramangala',
                  'Ward 174 - HSR Layout',
                  'Ward 177 - JP Nagar',
                  'Ward 192 - Begur',
                  'Ward 193 - Arakere',
                  'Ward 194 - Gottigere'
                ]
              }
            ]
          },
          {
            name: 'Uttarahalli Hobli',
            cities: [
              {
                name: 'Rajarajeshwari Nagar Zone',
                wards: ['Ward 160 - Rajarajeshwari Nagar', 'Ward 161 - Hosakerehalli', 'Ward 184 - Uttarahalli']
              }
            ]
          }
        ],
        cities: [
          {
            name: 'BBMP South Zone',
            wards: ['Ward 151 - Koramangala', 'Ward 174 - HSR Layout', 'Ward 177 - JP Nagar', 'Ward 192 - Begur', 'Ward 193 - Arakere']
          }
        ]
      },
      {
        name: 'Bengaluru East',
        hoblis: [
          {
            name: 'K.R. Puram Hobli',
            cities: [
              {
                name: 'Mahadevapura Zone',
                wards: [
                  'Ward 81 - Varthur',
                  'Ward 82 - Bellandur',
                  'Ward 83 - Kadugodi',
                  'Ward 84 - Hagadur (Whitefield)',
                  'Ward 85 - Doddanekkundi',
                  'Ward 86 - Marathahalli'
                ]
              }
            ]
          },
          {
            name: 'Bidarahalli Hobli',
            cities: [
              {
                name: 'East Sub-Division',
                wards: ['Ward 51 - Vijinapura', 'Ward 52 - KR Puram', 'Ward 53 - Basavanapura', 'Ward 54 - Hoodi']
              }
            ]
          }
        ],
        cities: [
          {
            name: 'Mahadevapura Zone',
            wards: ['Ward 81 - Varthur', 'Ward 82 - Bellandur', 'Ward 84 - Hagadur (Whitefield)', 'Ward 86 - Marathahalli']
          }
        ]
      },
      {
        name: 'Anekal Taluk',
        hoblis: [
          {
            name: 'Attibele Hobli',
            cities: [
              {
                name: 'Attibele Town',
                wards: ['Ward 1 - Border Gate', 'Ward 3 - Industrial Area', 'Ward 5 - Sarjapura Road Junction']
              }
            ]
          },
          {
            name: 'Sarjapura Hobli',
            cities: [
              {
                name: 'Sarjapura Sub-Zone',
                wards: ['Ward 2 - Sompura', 'Ward 4 - Sarjapura Circle', 'Ward 7 - Yamare Village Ward']
              }
            ]
          },
          {
            name: 'Jigani Hobli',
            cities: [
              {
                name: 'Jigani Industrial Township',
                wards: ['Ward 1 - APC Circle', 'Ward 4 - Bommasandra Link', 'Ward 8 - Haragadde']
              }
            ]
          }
        ],
        cities: [
          {
            name: 'Anekal TMC',
            wards: ['Ward 1 - Bus Stand Road', 'Ward 4 - Hospital Ward', 'Ward 9 - Thimmarayaswamy Temple']
          }
        ]
      }
    ]
  },
  {
    name: 'Bengaluru Rural',
    taluks: [
      {
        name: 'Devanahalli Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Devanahalli Town Municipal Council',
                wards: ['Ward 1 - Fort Area (Tipu Birthplace)', 'Ward 4 - BIAL Cargo Road', 'Ward 8 - Subhash Nagar', 'Ward 12 - Doddagowdana Colony']
              }
            ]
          },
          {
            name: 'Vijayapura Hobli',
            cities: [{ name: 'Vijayapura TMC', wards: ['Ward 1 - Market Area', 'Ward 3 - Channapatna Gate', 'Ward 6 - Railway Line Ward'] }]
          }
        ],
        cities: [{ name: 'Devanahalli TMC', wards: ['Fort Area', 'BIAL Cargo Road', 'Subhash Nagar'] }]
      },
      {
        name: 'Doddaballapura Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Doddaballapura CMC',
                wards: ['Ward 2 - Weaver Colony', 'Ward 7 - Basavanakote', 'Ward 14 - Railway Station Road', 'Ward 21 - Industrial Area']
              }
            ]
          },
          {
            name: 'Tubagere Hobli',
            cities: [{ name: 'Tubagere', wards: ['Grama Ward 1', 'Grama Ward 2'] }]
          }
        ],
        cities: [{ name: 'Doddaballapura CMC', wards: ['Weaver Colony', 'Basavanakote', 'Industrial Area'] }]
      },
      {
        name: 'Hosakote Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Hosakote CMC',
                wards: ['Ward 3 - MVJ Medical Area', 'Ward 8 - National Highway Junction', 'Ward 15 - Kote Area', 'Ward 22 - Chintamani Road']
              }
            ]
          },
          {
            name: 'Anugondanahalli Hobli',
            cities: [{ name: 'Anugondanahalli', wards: ['Main Ward', 'Lake View Ward'] }]
          }
        ],
        cities: [{ name: 'Hosakote CMC', wards: ['MVJ Medical Area', 'National Highway Junction', 'Kote Area'] }]
      },
      {
        name: 'Nelamangala Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Nelamangala TMC',
                wards: ['Ward 1 - Binnamangala', 'Ward 5 - Kunigal Bypass', 'Ward 9 - Subhash Nagar', 'Ward 13 - Tumkur Road Junction']
              }
            ]
          },
          {
            name: 'Tyamagondlu Hobli',
            cities: [{ name: 'Tyamagondlu TP', wards: ['Ward 1 - Bazaar', 'Ward 3 - Temple Street'] }]
          }
        ],
        cities: [{ name: 'Nelamangala TMC', wards: ['Binnamangala', 'Kunigal Bypass', 'Subhash Nagar'] }]
      }
    ]
  },
  {
    name: 'Bidar',
    taluks: [
      {
        name: 'Bidar Taluk',
        hoblis: [
          {
            name: 'Bidar Kasaba',
            cities: [
              {
                name: 'Bidar City Municipal Council',
                wards: ['Ward 2 - Fort Gate', 'Ward 8 - Mahmud Gawan Madrassa', 'Ward 15 - Gurudwara Nanak Jhira Area', 'Ward 24 - Mailoor', 'Ward 31 - Naubad']
              }
            ]
          }
        ],
        cities: [{ name: 'Bidar CMC', wards: ['Fort Gate', 'Mahmud Gawan', 'Gurudwara Area', 'Mailoor', 'Naubad'] }]
      },
      {
        name: 'Basavakalyan Taluk',
        cities: [{ name: 'Basavakalyan TMC', wards: ['Ward 1 - Basaveshwara Temple', 'Ward 5 - Fort Area', 'Ward 12 - Tripurantaka Lake Area'] }]
      },
      {
        name: 'Bhalki Taluk',
        cities: [{ name: 'Bhalki TMC', wards: ['Ward 2 - Hiremath Area', 'Ward 6 - Court Road', 'Ward 11 - Shivaji Chowk'] }]
      },
      {
        name: 'Homnabad Taluk',
        cities: [{ name: 'Homnabad TMC', wards: ['Ward 1 - Manik Prabhu Temple Area', 'Ward 5 - Hyderabad Road', 'Ward 9 - Ganj Market'] }]
      },
      {
        name: 'Aurad Taluk',
        cities: [{ name: 'Aurad TP', wards: ['Ward 1 - Amarja Colony', 'Ward 4 - Bus Stand Circle', 'Ward 7 - Court Area'] }]
      }
    ]
  },
  {
    name: 'Chamarajanagar',
    taluks: [
      {
        name: 'Chamarajanagar Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Chamarajanagar CMC',
                wards: ['Ward 1 - Chamarajeshwara Temple', 'Ward 6 - Ramasamudra', 'Ward 12 - Gundlupet Cross', 'Ward 19 - Galipur', 'Ward 27 - Santhemarahalli Circle']
              }
            ]
          }
        ],
        cities: [{ name: 'Chamarajanagar CMC', wards: ['Chamarajeshwara Temple', 'Ramasamudra', 'Galipur'] }]
      },
      {
        name: 'Gundlupete Taluk',
        cities: [{ name: 'Gundlupete TMC', wards: ['Ward 1 - Bandipur Gate', 'Ward 5 - Ooty Road', 'Ward 10 - Parvathi Temple'] }]
      },
      {
        name: 'Kollegala Taluk',
        cities: [{ name: 'Kollegala CMC', wards: ['Ward 3 - Silk Handloom Street', 'Ward 8 - Maramma Temple', 'Ward 14 - Malai Mahadeshwara Road'] }]
      },
      {
        name: 'Yelanduru Taluk',
        cities: [{ name: 'Yelanduru TP', wards: ['Ward 1 - Gaurishwara Temple', 'Ward 3 - BR Hills Road', 'Ward 6 - Biligiri Ward'] }]
      },
      {
        name: 'Hanur Taluk',
        cities: [{ name: 'Hanur TP', wards: ['Ward 1 - MM Hills Junction', 'Ward 4 - Forest Road', 'Ward 7 - Bazaar Street'] }]
      }
    ]
  },
  {
    name: 'Chikkaballapura',
    taluks: [
      {
        name: 'Chikkaballapura Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Chikkaballapura CMC',
                wards: ['Ward 1 - Nandi Hill Road', 'Ward 5 - Sir M Visvesvaraya Circle', 'Ward 11 - Prashanth Nagar', 'Ward 18 - Kandavara Lake Road', 'Ward 25 - Fort Ward']
              }
            ]
          },
          { name: 'Nandi Hobli', cities: [{ name: 'Nandi Village', wards: ['Bhoganandishwara Temple Ward', 'Gram Chowk'] }] }
        ],
        cities: [{ name: 'Chikkaballapura CMC', wards: ['Nandi Hill Road', 'Visvesvaraya Circle', 'Prashanth Nagar', 'Kandavara'] }]
      },
      {
        name: 'Bagepalli Taluk',
        cities: [{ name: 'Bagepalli TMC', wards: ['Ward 1 - National Highway 44', 'Ward 4 - Chitravathi River Ward', 'Ward 8 - APMC Market'] }]
      },
      {
        name: 'Chintamani Taluk',
        cities: [{ name: 'Chintamani CMC', wards: ['Ward 2 - Silk Cocoon Market', 'Ward 7 - Chelur Road', 'Ward 15 - Azad Chowk', 'Ward 22 - Kanampalli'] }]
      },
      {
        name: 'Gauribidanur Taluk',
        cities: [{ name: 'Gauribidanur CMC', wards: ['Ward 1 - Vidurashwatha Road', 'Ward 6 - Railway Colony', 'Ward 12 - Sugar Mill Road'] }]
      },
      {
        name: 'Sidlaghatta Taluk',
        cities: [{ name: 'Sidlaghatta TMC', wards: ['Ward 1 - Silk Reeling Area', 'Ward 5 - Melur Road', 'Ward 10 - Kotanoor Gate'] }]
      },
      {
        name: 'Gudibanda Taluk',
        cities: [{ name: 'Gudibanda TP', wards: ['Ward 1 - Fort Hill Road', 'Ward 3 - Amanikere', 'Ward 6 - Hospital Road'] }]
      }
    ]
  },
  {
    name: 'Chikkamagaluru',
    taluks: [
      {
        name: 'Chikkamagaluru Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Chikkamagaluru CMC',
                wards: ['Ward 1 - Mullayanagiri Road', 'Ward 6 - Coffee Board Layout', 'Ward 14 - IG Road', 'Ward 21 - Dantaramakki', 'Ward 29 - Basavanahalli']
              }
            ]
          }
        ],
        cities: [{ name: 'Chikkamagaluru CMC', wards: ['Coffee Board Layout', 'IG Road', 'Dantaramakki', 'Basavanahalli'] }]
      },
      {
        name: 'Kadur Taluk',
        cities: [{ name: 'Kadur TMC', wards: ['Ward 1 - Railway Colony', 'Ward 5 - Birur Road', 'Ward 9 - Anjaneya Temple'] }]
      },
      {
        name: 'Mudigere Taluk',
        cities: [{ name: 'Mudigere TP', wards: ['Ward 1 - Handpost', 'Ward 4 - Coffee Planters Colony', 'Ward 7 - Charmadi Ghat Approach'] }]
      },
      {
        name: 'Tarikere Taluk',
        cities: [{ name: 'Tarikere TMC', wards: ['Ward 2 - Bhadra Canal Ward', 'Ward 6 - Kote Area', 'Ward 11 - Station Circle'] }]
      },
      {
        name: 'Sringeri Taluk',
        cities: [{ name: 'Sringeri TP', wards: ['Ward 1 - Sharada Peetham Area', 'Ward 3 - Tunga River Bank', 'Ward 5 - Bharathi Street'] }]
      },
      {
        name: 'Koppa Taluk',
        cities: [{ name: 'Koppa TP', wards: ['Ward 1 - Tunga View', 'Ward 3 - Planters Club Area', 'Ward 6 - Bus Stand'] }]
      },
      {
        name: 'Narasimharajapura Taluk',
        cities: [{ name: 'N.R. Pura TP', wards: ['Ward 1 - Bhadra Reservoir Road', 'Ward 3 - Church Ward', 'Ward 5 - Market'] }]
      }
    ]
  },
  {
    name: 'Chitradurga',
    taluks: [
      {
        name: 'Chitradurga Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Chitradurga CMC',
                wards: ['Ward 1 - Kallina Kote (Fort)', 'Ward 7 - Onake Obavva Circle', 'Ward 15 - Holalkere Road', 'Ward 22 - Medehalli', 'Ward 30 - Kelagote']
              }
            ]
          }
        ],
        cities: [{ name: 'Chitradurga CMC', wards: ['Kallina Kote', 'Obavva Circle', 'Medehalli', 'Kelagote'] }]
      },
      {
        name: 'Challakere Taluk',
        cities: [{ name: 'Challakere TMC', wards: ['Ward 2 - Oil Mill Area', 'Ward 6 - Bellary Road', 'Ward 11 - Science City Gate'] }]
      },
      {
        name: 'Hiriyur Taluk',
        cities: [{ name: 'Hiriyur TMC', wards: ['Ward 1 - Vani Vilasa Sagara Road', 'Ward 5 - National Highway 48', 'Ward 10 - Vedavathi River Ward'] }]
      },
      {
        name: 'Holalkere Taluk',
        cities: [{ name: 'Holalkere TP', wards: ['Ward 1 - Ganapathi Temple Area', 'Ward 4 - Railway Station', 'Ward 7 - Court Circle'] }]
      },
      {
        name: 'Hosadurga Taluk',
        cities: [{ name: 'Hosadurga TMC', wards: ['Ward 1 - Cement Factory Area', 'Ward 5 - Kote Road', 'Ward 9 - Bus Stand'] }]
      },
      {
        name: 'Molakalmuru Taluk',
        cities: [{ name: 'Molakalmuru TP', wards: ['Ward 1 - Saree Weavers Street', 'Ward 3 - Nunke Bhairava Hill Area', 'Ward 6 - Border Road'] }]
      }
    ]
  },
  {
    name: 'Dakshina Kannada (Mangaluru)',
    taluks: [
      {
        name: 'Mangaluru City & Taluk',
        hoblis: [
          {
            name: 'Mangaluru Kasaba',
            cities: [
              {
                name: 'Mangaluru City Corporation (MCC)',
                wards: [
                  'Ward 1 - Surathkal West',
                  'Ward 2 - Surathkal East',
                  'Ward 12 - Panambur Port',
                  'Ward 24 - Bejai Commercial',
                  'Ward 32 - Kadri Hills',
                  'Ward 41 - Hampankatta Central',
                  'Ward 58 - Bolar Fishery Wharf'
                ]
              }
            ]
          },
          {
            name: 'Surathkal Hobli',
            cities: [{ name: 'Surathkal Sub-Division', wards: ['Ward 1 - Surathkal West', 'Ward 2 - Surathkal East', 'Ward 3 - Kulai'] }]
          }
        ],
        cities: [{ name: 'Mangaluru City Corporation', wards: ['Kadri Hills', 'Hampankatta Central', 'Bejai Commercial', 'Surathkal West', 'Panambur Port'] }]
      },
      {
        name: 'Bantwal Taluk',
        cities: [{ name: 'Bantwal TMC', wards: ['Ward 2 - B.C. Road Flyover', 'Ward 7 - Netravati River Bank', 'Ward 14 - Panemangalore'] }]
      },
      {
        name: 'Puttur Taluk',
        cities: [{ name: 'Puttur CMC', wards: ['Ward 1 - Mahalingeshwara Temple', 'Ward 6 - Darbe Circle', 'Ward 12 - Bolwar', 'Ward 19 - Parladka'] }]
      },
      {
        name: 'Belthangady Taluk',
        cities: [{ name: 'Belthangady TP', wards: ['Ward 1 - Dharmasthala Road', 'Ward 4 - Santhekatte', 'Ward 8 - Ujire Link Road'] }]
      },
      {
        name: 'Sullia Taluk',
        cities: [{ name: 'Sullia TP', wards: ['Ward 1 - Payaswani River Road', 'Ward 4 - Gandhinagar', 'Ward 7 - Temple Road'] }]
      },
      {
        name: 'Moodabidri Taluk',
        cities: [{ name: 'Moodabidri TMC', wards: ['Ward 1 - Thousand Pillars Basadi', 'Ward 5 - Alvas College Area', 'Ward 9 - Vidyagiri'] }]
      },
      {
        name: 'Kadaba Taluk',
        cities: [{ name: 'Kadaba TP', wards: ['Ward 1 - Subrahmanya Junction', 'Ward 3 - Court Road', 'Ward 6 - Main Road'] }]
      }
    ]
  },
  {
    name: 'Davanagere',
    taluks: [
      {
        name: 'Davanagere Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Davanagere City Corporation',
                wards: ['Ward 6 - MCC Block A', 'Ward 15 - Mandipet Cotton Market', 'Ward 24 - Vidyanagar', 'Ward 33 - Shamanur Road', 'Ward 42 - Nituvalli']
              }
            ]
          }
        ],
        cities: [{ name: 'Davanagere City Corporation', wards: ['MCC Block A', 'Mandipet Cotton Market', 'Vidyanagar', 'Shamanur Road'] }]
      },
      {
        name: 'Harihara Taluk',
        cities: [{ name: 'Harihara CMC', wards: ['Ward 1 - Harihareshwara Temple', 'Ward 6 - Tungabhadra Bank', 'Ward 12 - Polyfibres Colony'] }]
      },
      {
        name: 'Channagiri Taluk',
        cities: [{ name: 'Channagiri TMC', wards: ['Ward 1 - Fort Hill', 'Ward 4 - Arecanut Market', 'Ward 8 - Shanthi Sagar Road'] }]
      },
      {
        name: 'Honnali Taluk',
        cities: [{ name: 'Honnali TMC', wards: ['Ward 1 - River Bank Ward', 'Ward 4 - Fort Ward', 'Ward 8 - Shimoga Road'] }]
      },
      {
        name: 'Jagalur Taluk',
        cities: [{ name: 'Jagalur TP', wards: ['Ward 1 - Bus Stand Road', 'Ward 4 - Mahatma Gandhi Circle', 'Ward 7 - Hospital Ward'] }]
      },
      {
        name: 'Nyamathi Taluk',
        cities: [{ name: 'Nyamathi TP', wards: ['Ward 1 - Main Bazaar', 'Ward 3 - River Bridge Ward', 'Ward 5 - APMC'] }]
      }
    ]
  },
  {
    name: 'Dharwad (Hubballi-Dharwad)',
    taluks: [
      {
        name: 'Hubballi Urban',
        hoblis: [
          {
            name: 'Hubballi Kasaba',
            cities: [
              {
                name: 'Hubballi-Dharwad Municipal Corporation (HDMC)',
                wards: [
                  'Ward 12 - Vidyanagar Hubballi',
                  'Ward 18 - Keshwapur',
                  'Ward 24 - Deshpande Nagar',
                  'Ward 36 - Durgadbail Market',
                  'Ward 45 - Old Hubballi',
                  'Ward 55 - Gokul Road Industrial'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Hubballi Municipal Corporation', wards: ['Vidyanagar', 'Keshwapur', 'Deshpande Nagar', 'Durgadbail', 'Gokul Road'] }]
      },
      {
        name: 'Dharwad Taluk',
        hoblis: [
          {
            name: 'Dharwad Kasaba',
            cities: [
              {
                name: 'Dharwad City Sub-Division',
                wards: ['Ward 1 - Saptapur', 'Ward 5 - Malmaddi', 'Ward 9 - Kalyan Nagar', 'Ward 14 - KUD Campus (University)']
              }
            ]
          }
        ],
        cities: [{ name: 'Dharwad City', wards: ['Saptapur', 'Malmaddi', 'Kalyan Nagar', 'KUD Campus'] }]
      },
      {
        name: 'Kundgol Taluk',
        cities: [{ name: 'Kundgol TP', wards: ['Ward 1 - Sawai Gandharva Memorial Area', 'Ward 4 - Railway Station', 'Ward 7 - Market'] }]
      },
      {
        name: 'Navalgund Taluk',
        cities: [{ name: 'Navalgund TMC', wards: ['Ward 1 - Carpet Weavers Street', 'Ward 5 - Model High School Area', 'Ward 9 - Bus Stand'] }]
      },
      {
        name: 'Kalghatgi Taluk',
        cities: [{ name: 'Kalghatgi TP', wards: ['Ward 1 - Forest Colony', 'Ward 4 - Bus Stand', 'Ward 7 - Hospital Road'] }]
      },
      {
        name: 'Alnavar Taluk',
        cities: [{ name: 'Alnavar TP', wards: ['Ward 1 - Railway Colony', 'Ward 3 - Wood Industry Ward', 'Ward 6 - Main Road'] }]
      },
      {
        name: 'Annigeri Taluk',
        cities: [{ name: 'Annigeri TMC', wards: ['Ward 1 - Amrutheshwara Temple', 'Ward 4 - Raita Bazaar', 'Ward 8 - Station Road'] }]
      }
    ]
  },
  {
    name: 'Gadag',
    taluks: [
      {
        name: 'Gadag-Betageri Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Gadag-Betageri CMC',
                wards: ['Ward 2 - Tontadarya Matha Area', 'Ward 8 - Trikuteshwara Temple', 'Ward 16 - Betageri Weavers Colony', 'Ward 24 - Mulgund Naka', 'Ward 31 - Pala Badami Road']
              }
            ]
          }
        ],
        cities: [{ name: 'Gadag-Betageri CMC', wards: ['Tontadarya Matha', 'Trikuteshwara Temple', 'Betageri Weavers Colony', 'Mulgund Naka'] }]
      },
      {
        name: 'Mundargi Taluk',
        cities: [{ name: 'Mundargi TMC', wards: ['Ward 1 - Kappathagudda Hill View', 'Ward 4 - Tungabhadra Road', 'Ward 8 - Fort Ward'] }]
      },
      {
        name: 'Nargund Taluk',
        cities: [{ name: 'Nargund TMC', wards: ['Ward 1 - Baba Saheb Fort', 'Ward 5 - Malaprabha Canal', 'Ward 9 - Cotton Market'] }]
      },
      {
        name: 'Ron Taluk',
        cities: [{ name: 'Ron TMC', wards: ['Ward 1 - Dronacharya Temple Area', 'Ward 4 - Court Circle', 'Ward 8 - Gajendragad Road'] }]
      },
      {
        name: 'Shirahatti Taluk',
        cities: [{ name: 'Shirahatti TP', wards: ['Ward 1 - Fakira Matha Area', 'Ward 3 - Bazaar', 'Ward 6 - Hospital Road'] }]
      },
      {
        name: 'Gajendragad Taluk',
        cities: [{ name: 'Gajendragad TMC', wards: ['Ward 1 - Fort Hill', 'Ward 5 - Handloom Ward', 'Ward 9 - Main Road'] }]
      },
      {
        name: 'Lakshmeshwar Taluk',
        cities: [{ name: 'Lakshmeshwar TMC', wards: ['Ward 1 - Someshwara Temple', 'Ward 5 - Jaina Basadi Area', 'Ward 9 - Old Town'] }]
      }
    ]
  },
  {
    name: 'Hassan',
    taluks: [
      {
        name: 'Hassan Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Hassan City Municipal Council',
                wards: ['Ward 3 - Hasanamba Temple Area', 'Ward 9 - K.R. Puram Hassan', 'Ward 16 - Shankaripuram', 'Ward 25 - Dairy Circle', 'Ward 32 - Vidyanagar']
              }
            ]
          }
        ],
        cities: [{ name: 'Hassan CMC', wards: ['Hasanamba Temple', 'K.R. Puram Hassan', 'Shankaripuram', 'Dairy Circle'] }]
      },
      {
        name: 'Belur Taluk',
        cities: [{ name: 'Belur TMC', wards: ['Ward 1 - Chennakeshava Temple Precinct', 'Ward 5 - Yagachi River Bank', 'Ward 9 - Temple Car Street'] }]
      },
      {
        name: 'Halebeedu & Javagal (Hassan Sub)',
        cities: [{ name: 'Halebeedu Heritage Ward', wards: ['Hoysaleshwara Temple Area', 'Kedareshwara Ward', 'Archaeology Road'] }]
      },
      {
        name: 'Channarayapatna Taluk',
        cities: [{ name: 'Channarayapatna TMC', wards: ['Ward 1 - National Highway 75', 'Ward 6 - Shravanabelagola Road', 'Ward 12 - BM Road'] }]
      },
      {
        name: 'Shravanabelagola (Sub-Town)',
        cities: [{ name: 'Shravanabelagola Heritage Center', wards: ['Vindhyagiri Hill Foot', 'Chandragiri Hill Foot', 'Kalyani Ward'] }]
      },
      {
        name: 'Arsikere Taluk',
        cities: [{ name: 'Arsikere CMC', wards: ['Ward 1 - Railway Junction', 'Ward 6 - Kalmeshwara Temple', 'Ward 14 - Coconut Market'] }]
      },
      {
        name: 'Sakleshpur Taluk',
        cities: [{ name: 'Sakleshpur TMC', wards: ['Ward 1 - Hemavathi River View', 'Ward 4 - Coffee Plantation Hub', 'Ward 8 - BM Road', 'Ward 12 - Manjarabad Fort Road'] }]
      },
      {
        name: 'Holenarasipura Taluk',
        cities: [{ name: 'Holenarasipura TMC', wards: ['Ward 1 - Lakshmi Narasimha Temple', 'Ward 5 - Hemavathi River Bank', 'Ward 10 - Fort Area'] }]
      },
      {
        name: 'Arkalgud Taluk',
        cities: [{ name: 'Arkalgud TP', wards: ['Ward 1 - Amrutheshwara Area', 'Ward 4 - Bazaar', 'Ward 7 - Hospital Circle'] }]
      },
      {
        name: 'Alur Taluk',
        cities: [{ name: 'Alur TP', wards: ['Ward 1 - Bus Stand', 'Ward 3 - Court Road', 'Ward 5 - Kote'] }]
      }
    ]
  },
  {
    name: 'Haveri',
    taluks: [
      {
        name: 'Haveri Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Haveri CMC',
                wards: ['Ward 1 - Siddheswara Temple Area', 'Ward 6 - Vidyanagar Haveri', 'Ward 12 - PB Road (NH48)', 'Ward 20 - Railway Colony']
              }
            ]
          }
        ],
        cities: [{ name: 'Haveri CMC', wards: ['Siddheswara Temple Area', 'Vidyanagar Haveri', 'PB Road', 'Railway Colony'] }]
      },
      {
        name: 'Ranibennur Taluk',
        cities: [{ name: 'Ranibennur CMC', wards: ['Ward 2 - Seed Market Yard', 'Ward 8 - Blackbuck Sanctuary Road', 'Ward 16 - Station Road', 'Ward 24 - Medleri Road'] }]
      },
      {
        name: 'Byadgi Taluk',
        cities: [{ name: 'Byadgi TMC', wards: ['Ward 1 - International Chilli APMC Yard', 'Ward 5 - Main Market', 'Ward 9 - Station Road'] }]
      },
      {
        name: 'Hangal Taluk',
        cities: [{ name: 'Hangal TMC', wards: ['Ward 1 - Tarakeshwara Temple', 'Ward 4 - Veerabhadra Temple', 'Ward 8 - Anekere Lake View'] }]
      },
      {
        name: 'Savanur Taluk',
        cities: [{ name: 'Savanur TMC', wards: ['Ward 1 - Nawab Palace Road', 'Ward 5 - Baobab Trees Precinct', 'Ward 9 - Khazi Mohalla'] }]
      },
      {
        name: 'Shiggaon Taluk',
        cities: [{ name: 'Shiggaon TMC', wards: ['Ward 1 - National Highway Ward', 'Ward 4 - Folk University Area', 'Ward 8 - Santhe Maidan'] }]
      },
      {
        name: 'Hirekerur Taluk',
        cities: [{ name: 'Hirekerur TP', wards: ['Ward 1 - Durga Devi Temple', 'Ward 4 - Durgigudi', 'Ward 7 - Market'] }]
      },
      {
        name: 'Rattihalli Taluk',
        cities: [{ name: 'Rattihalli TP', wards: ['Ward 1 - Kadambeshwara Area', 'Ward 3 - Kumadvathi Bank', 'Ward 5 - Bus Stand'] }]
      }
    ]
  },
  {
    name: 'Kalaburagi',
    taluks: [
      {
        name: 'Kalaburagi Urban & Taluk',
        hoblis: [
          {
            name: 'Kalaburagi Kasaba',
            cities: [
              {
                name: 'Kalaburagi City Corporation',
                wards: [
                  'Ward 2 - Khwaja Bande Nawaz Dargah Area',
                  'Ward 9 - Brahmpur',
                  'Ward 17 - Supermarket Circle',
                  'Ward 26 - Sharan Nagar',
                  'Ward 34 - Sedam Road',
                  'Ward 43 - High Court Bench Area',
                  'Ward 51 - Gulbarga Fort'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Kalaburagi City Corporation', wards: ['Brahmpur', 'Supermarket Circle', 'Sharan Nagar', 'Sedam Road', 'Gulbarga Fort'] }]
      },
      {
        name: 'Aland Taluk',
        cities: [{ name: 'Aland TMC', wards: ['Ward 1 - Ladle Mashak Dargah', 'Ward 5 - Market Yard', 'Ward 10 - Main Bus Stand'] }]
      },
      {
        name: 'Afzalpur Taluk',
        cities: [{ name: 'Afzalpur TP', wards: ['Ward 1 - Bhima River Bank', 'Ward 4 - Court Road', 'Ward 8 - Ganj Area'] }]
      },
      {
        name: 'Chincholi Taluk',
        cities: [{ name: 'Chincholi TP', wards: ['Ward 1 - Chandrampalli Dam Road', 'Ward 4 - Wildlife Sanctuary Road', 'Ward 7 - Main Market'] }]
      },
      {
        name: 'Chitapur Taluk',
        cities: [{ name: 'Chitapur TMC', wards: ['Ward 1 - Cement Factory Area', 'Ward 5 - Railway Station', 'Ward 9 - Nagai Heritage Ward'] }]
      },
      {
        name: 'Jevargi Taluk',
        cities: [{ name: 'Jevargi TP', wards: ['Ward 1 - Bhima River Bridge', 'Ward 4 - National Highway Cross', 'Ward 7 - Court Circle'] }]
      },
      {
        name: 'Sedam Taluk',
        cities: [{ name: 'Sedam TMC', wards: ['Ward 1 - Vasavadatta Cement Road', 'Ward 5 - Kaginele Matha Area', 'Ward 9 - Railway Colony'] }]
      },
      {
        name: 'Shahabad Taluk',
        cities: [{ name: 'Shahabad CMC', wards: ['Ward 1 - Stone Quarry Area', 'Ward 6 - Railway Junction', 'Ward 12 - Bhima Colony'] }]
      }
    ]
  },
  {
    name: 'Kodagu (Madikeri)',
    taluks: [
      {
        name: 'Madikeri Taluk',
        hoblis: [
          {
            name: 'Madikeri Kasaba',
            cities: [
              {
                name: 'Madikeri City Municipal Council',
                wards: ['Ward 1 - Raja Seat Scenic View', 'Ward 4 - Madikeri Fort Area', 'Ward 9 - College Road', 'Ward 15 - Stuart Hill', 'Ward 21 - Mahadevpet Commercial']
              }
            ]
          },
          { name: 'Bhagamandala Hobli', cities: [{ name: 'Bhagamandala & Talakaveri', wards: ['Triveni Sangama Ward', 'Talakaveri Temple Ward'] }] }
        ],
        cities: [{ name: 'Madikeri CMC', wards: ['Raja Seat', 'Madikeri Fort', 'Stuart Hill', 'Mahadevpet Commercial'] }]
      },
      {
        name: 'Somwarpet Taluk',
        cities: [{ name: 'Somwarpet TP', wards: ['Ward 1 - Coffee Estate Road', 'Ward 4 - Honnamana Kere Road', 'Ward 8 - Bus Stand'] }]
      },
      {
        name: 'Kushalnagar Taluk',
        cities: [{ name: 'Kushalnagar TMC', wards: ['Ward 1 - Kaveri Nisargadhama Area', 'Ward 5 - Bylakuppe Golden Temple Road', 'Ward 9 - BM Road', 'Ward 14 - Industrial Area'] }]
      },
      {
        name: 'Virajpet Taluk',
        cities: [{ name: 'Virajpet TMC', wards: ['Ward 1 - Clock Tower Circle', 'Ward 4 - St Anne Church Area', 'Ward 8 - Malethirike Hill Ward'] }]
      },
      {
        name: 'Ponnampet Taluk',
        cities: [{ name: 'Ponnampet TP', wards: ['Ward 1 - Forestry College Road', 'Ward 3 - Coorg Sports Complex', 'Ward 6 - Main Bazaar'] }]
      }
    ]
  },
  {
    name: 'Kolar',
    taluks: [
      {
        name: 'Kolar Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Kolar City Municipal Council',
                wards: ['Ward 2 - Kolaramma Temple Precinct', 'Ward 8 - Clock Tower Circle', 'Ward 15 - Bangarapet Road', 'Ward 24 - Gandhinagar Kolar', 'Ward 31 - Fort Ward']
              }
            ]
          }
        ],
        cities: [{ name: 'Kolar CMC', wards: ['Kolaramma Temple', 'Clock Tower Circle', 'Bangarapet Road', 'Gandhinagar Kolar'] }]
      },
      {
        name: 'Bangarapet Taluk',
        cities: [{ name: 'Bangarapet TMC', wards: ['Ward 1 - Railway Junction Colony', 'Ward 5 - Desihalli', 'Ward 9 - Market Yard'] }]
      },
      {
        name: 'Kolar Gold Fields (KGF / Robertsonpet)',
        cities: [{ name: 'KGF City Municipal Council', wards: ['Ward 1 - Champion Reefs', 'Ward 7 - Marikuppam Gold Mine', 'Ward 14 - Oorgaum', 'Ward 22 - Andersonpet', 'Ward 29 - Coromandel'] }]
      },
      {
        name: 'Malur Taluk',
        cities: [{ name: 'Malur TMC', wards: ['Ward 1 - Industrial Area Phase 1', 'Ward 6 - Railway Station Road', 'Ward 11 - Maruthi Extension'] }]
      },
      {
        name: 'Mulbagal Taluk',
        cities: [{ name: 'Mulbagal TMC', wards: ['Ward 1 - Anjaneya Temple Ward', 'Ward 5 - Shripadaraja Matha', 'Ward 10 - Chennai National Highway'] }]
      },
      {
        name: 'Srinivaspura Taluk',
        cities: [{ name: 'Srinivaspura TMC', wards: ['Ward 1 - Mango Market Yard', 'Ward 4 - Bus Stand Circle', 'Ward 8 - Hospital Road'] }]
      }
    ]
  },
  {
    name: 'Koppal',
    taluks: [
      {
        name: 'Koppal Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Koppal City Municipal Council',
                wards: ['Ward 1 - Gavisiddeshwara Matha Area', 'Ward 6 - Koppal Fort Hill', 'Ward 13 - Ashok Circle', 'Ward 21 - Bhagyanagar', 'Ward 28 - Hosalli Road']
              }
            ]
          }
        ],
        cities: [{ name: 'Koppal CMC', wards: ['Gavisiddeshwara Matha', 'Koppal Fort Hill', 'Ashok Circle', 'Bhagyanagar'] }]
      },
      {
        name: 'Gangavathi Taluk',
        cities: [{ name: 'Gangavathi CMC', wards: ['Ward 2 - Rice Mill Industrial Area', 'Ward 8 - CBS Circle', 'Ward 15 - Julai Nagar', 'Ward 23 - Anegundi Heritage Road'] }]
      },
      {
        name: 'Anegundi (Kishkindha Heritage)',
        cities: [{ name: 'Anegundi Heritage Village', wards: ['Ranganatha Temple Ward', 'Huchappayana Matha', 'Pampa Sarovara Ward'] }]
      },
      {
        name: 'Kushtagi Taluk',
        cities: [{ name: 'Kushtagi TMC', wards: ['Ward 1 - National Highway 50', 'Ward 5 - APMC Market', 'Ward 9 - Bus Stand Area'] }]
      },
      {
        name: 'Yelburga Taluk',
        cities: [{ name: 'Yelburga TP', wards: ['Ward 1 - Fort Area', 'Ward 4 - Court Road', 'Ward 7 - Main Bazaar'] }]
      },
      {
        name: 'Kanakagiri Taluk',
        cities: [{ name: 'Kanakagiri TP', wards: ['Ward 1 - Kanakachala Lakshmi Narasimha Temple', 'Ward 4 - Royal Bath Area', 'Ward 7 - Market'] }]
      },
      {
        name: 'Karatagi Taluk',
        cities: [{ name: 'Karatagi TMC', wards: ['Ward 1 - Paddy Hub Yard', 'Ward 4 - Main Road', 'Ward 8 - Gandhinagar'] }]
      }
    ]
  },
  {
    name: 'Mandya',
    taluks: [
      {
        name: 'Mandya Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Mandya City Municipal Council',
                wards: ['Ward 2 - Sugar Factory (MySugar) Colony', 'Ward 7 - Subhash Nagar Mandya', 'Ward 14 - Bengaluru-Mysuru Expressway Link', 'Ward 22 - Guthalu Colony', 'Ward 31 - Ashoknagar']
              }
            ]
          }
        ],
        cities: [{ name: 'Mandya CMC', wards: ['MySugar Colony', 'Subhash Nagar', 'Expressway Link', 'Guthalu Colony'] }]
      },
      {
        name: 'Maddur Taluk',
        cities: [{ name: 'Maddur TMC', wards: ['Ward 1 - Maddur Vada Commercial Hub', 'Ward 5 - Shimsha River Bank', 'Ward 10 - Railway Station Area'] }]
      },
      {
        name: 'Malavalli Taluk',
        cities: [{ name: 'Malavalli TMC', wards: ['Ward 1 - Marehalli Temple Road', 'Ward 6 - Kollegala Road', 'Ward 11 - Fort Ward'] }]
      },
      {
        name: 'Srirangapatna Taluk',
        cities: [{ name: 'Srirangapatna TMC', wards: ['Ward 1 - Ranganathaswamy Temple Precinct', 'Ward 5 - Tipu Sultan Summer Palace (Daria Daulat)', 'Ward 9 - Sangama Kaveri Bank', 'Ward 14 - Fort Moat Ward'] }]
      },
      {
        name: 'Pandavapura Taluk',
        cities: [{ name: 'Pandavapura TMC', wards: ['Ward 1 - French Rocks Heritage Area', 'Ward 4 - Sugar Mill Area', 'Ward 8 - Railway Station'] }]
      },
      {
        name: 'Krishnarajpet (K.R. Pet) Taluk',
        cities: [{ name: 'K.R. Pet TMC', wards: ['Ward 1 - Hemavathi River View', 'Ward 5 - Hosaholalu Lakshminarayana Temple', 'Ward 9 - Bus Stand'] }]
      },
      {
        name: 'Nagamangala Taluk',
        cities: [{ name: 'Nagamangala TMC', wards: ['Ward 1 - Saumyakeshava Temple', 'Ward 4 - Bellur Cross Road', 'Ward 8 - Fort Ward'] }]
      }
    ]
  },
  {
    name: 'Mysuru',
    taluks: [
      {
        name: 'Mysuru City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Mysuru City Corporation (MCC)',
                wards: [
                  'Ward 1 - Chamundi Hill Temple Precinct',
                  'Ward 8 - Mysore Palace & Agrahara',
                  'Ward 16 - Gokulam Yoga Hub',
                  'Ward 24 - Jayalakshmipuram',
                  'Ward 35 - Saraswathipuram',
                  'Ward 46 - Kuvempunagar',
                  'Ward 54 - Hebbal Industrial Area',
                  'Ward 62 - Vijayanagar Mysore'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Mysuru City Corporation', wards: ['Chamundi Hill', 'Mysore Palace & Agrahara', 'Gokulam', 'Jayalakshmipuram', 'Kuvempunagar', 'Vijayanagar Mysore'] }]
      },
      {
        name: 'Nanjangud Taluk',
        cities: [{ name: 'Nanjangud CMC', wards: ['Ward 1 - Srikanteshwara (Nanjundeshwara) Temple', 'Ward 6 - Kapila River Ghat', 'Ward 14 - Industrial Area Phase 2'] }]
      },
      {
        name: 'Hunsur Taluk',
        cities: [{ name: 'Hunsur TMC', wards: ['Ward 1 - Lakshmanathirtha River Bank', 'Ward 5 - Nagarhole Safari Gate Road', 'Ward 10 - Timber Yard Area'] }]
      },
      {
        name: 'Krishnarajanagara (K.R. Nagar) Taluk',
        cities: [{ name: 'K.R. Nagar TMC', wards: ['Ward 1 - Kaveri River Bridge', 'Ward 5 - Arkeshwara Temple', 'Ward 9 - Railway Station Road'] }]
      },
      {
        name: 'Tirumakudalu Narasipura (T. Narasipura) Taluk',
        cities: [{ name: 'T. Narasipura TP', wards: ['Ward 1 - Triveni Sangama Precinct', 'Ward 4 - Gunja Narasimhaswamy Temple', 'Ward 7 - Market Street'] }]
      },
      {
        name: 'Heggadadevankote (H.D. Kote) Taluk',
        cities: [{ name: 'H.D. Kote TP', wards: ['Ward 1 - Kabini Dam Approach', 'Ward 4 - Forest Colony', 'Ward 8 - Bus Stand'] }]
      },
      {
        name: 'Piriyapatna Taluk',
        cities: [{ name: 'Piriyapatna TP', wards: ['Ward 1 - Tobacco Board Auction Yard', 'Ward 4 - Bylakuppe Border', 'Ward 7 - Fort Ward'] }]
      },
      {
        name: 'Saragur Taluk',
        cities: [{ name: 'Saragur TP', wards: ['Ward 1 - Nugu River Area', 'Ward 3 - Swami Vivekananda Hospital Road', 'Ward 6 - Main Road'] }]
      }
    ]
  },
  {
    name: 'Raichur',
    taluks: [
      {
        name: 'Raichur City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Raichur City Municipal Council',
                wards: ['Ward 3 - Raichur Fort & Ek Minar', 'Ward 9 - Station Road Raichur', 'Ward 17 - Mangalwarpet', 'Ward 25 - RTPS Thermal Plant Road', 'Ward 33 - Nijalingappa Colony']
              }
            ]
          }
        ],
        cities: [{ name: 'Raichur CMC', wards: ['Raichur Fort', 'Station Road', 'Mangalwarpet', 'RTPS Road'] }]
      },
      {
        name: 'Sindhanur Taluk',
        cities: [{ name: 'Sindhanur CMC', wards: ['Ward 1 - Paddy Capital Granary Area', 'Ward 7 - Kushtagi Road', 'Ward 15 - Sukhalpet', 'Ward 22 - Ganj Market'] }]
      },
      {
        name: 'Manvi Taluk',
        cities: [{ name: 'Manvi TMC', wards: ['Ward 1 - Dasara Matha Road', 'Ward 5 - Fort Ward', 'Ward 9 - Bus Stand Circle'] }]
      },
      {
        name: 'Lingsugur Taluk',
        cities: [{ name: 'Lingsugur TMC', wards: ['Ward 1 - Hutti Gold Mines Road', 'Ward 5 - Court Circle', 'Ward 9 - Karadkal'] }]
      },
      {
        name: 'Devadurga Taluk',
        cities: [{ name: 'Devadurga TP', wards: ['Ward 1 - Krishna River Basin Ward', 'Ward 4 - Fort Area', 'Ward 7 - Market Street'] }]
      },
      {
        name: 'Maski Taluk',
        cities: [{ name: 'Maski TP', wards: ['Ward 1 - Ashokan Rock Edict Heritage Area', 'Ward 4 - Main Road', 'Ward 7 - Bus Stand'] }]
      },
      {
        name: 'Sirwar Taluk',
        cities: [{ name: 'Sirwar TP', wards: ['Ward 1 - Main Chowk', 'Ward 3 - Market Yard', 'Ward 6 - Station Road'] }]
      }
    ]
  },
  {
    name: 'Ramanagara',
    taluks: [
      {
        name: 'Ramanagara Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Ramanagara City Municipal Council',
                wards: ['Ward 1 - Ramadevara Betta (Vulture Sanctuary / Sholay Hill)', 'Ward 6 - Silk Cocoon Market (Asia Largest)', 'Ward 12 - Ijoor', 'Ward 19 - Vijayanagar Ramanagara', 'Ward 26 - Tipu Fort Ward']
              }
            ]
          }
        ],
        cities: [{ name: 'Ramanagara CMC', wards: ['Ramadevara Betta', 'Silk Cocoon Market', 'Ijoor', 'Vijayanagar Ramanagara'] }]
      },
      {
        name: 'Channapatna Taluk',
        cities: [{ name: 'Channapatna CMC', wards: ['Ward 1 - Wooden Toy Craft Complex', 'Ward 6 - Bangalore-Mysore Highway', 'Ward 14 - Kote Channapatna', 'Ward 21 - Mangalwarpet'] }]
      },
      {
        name: 'Kanakapura Taluk',
        cities: [{ name: 'Kanakapura CMC', wards: ['Ward 1 - Arkavathi River Ghat', 'Ward 5 - Sangama Mekedatu Road', 'Ward 11 - Fort Ward', 'Ward 18 - Rural College Area'] }]
      },
      {
        name: 'Magadi Taluk',
        cities: [{ name: 'Magadi TMC', wards: ['Ward 1 - Kempegowda Fort', 'Ward 4 - Ranganathaswamy Temple', 'Ward 8 - Someshwara Ward'] }]
      },
      {
        name: 'Harohalli Taluk',
        cities: [{ name: 'Harohalli Industrial Area', wards: ['Industrial Area Phase 1', 'Phase 2 KIADB', 'Grama Chowk'] }]
      }
    ]
  },
  {
    name: 'Shivamogga',
    taluks: [
      {
        name: 'Shivamogga City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Shivamogga City Corporation',
                wards: [
                  'Ward 2 - Gandhi Bazaar Commercial',
                  'Ward 11 - Durgigudi',
                  'Ward 19 - Vinoba Nagar',
                  'Ward 28 - Tilak Nagar',
                  'Ward 37 - Vidyanagar Shimoga',
                  'Ward 45 - Tunga River View Promenade'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Shivamogga City Corporation', wards: ['Gandhi Bazaar', 'Durgigudi', 'Vinoba Nagar', 'Tilak Nagar', 'Vidyanagar Shimoga'] }]
      },
      {
        name: 'Bhadravathi Taluk',
        cities: [{ name: 'Bhadravathi CMC', wards: ['Ward 1 - VISL Steel Plant Township', 'Ward 6 - MPM Paper Mill Area', 'Ward 14 - Bhadra River Bank', 'Ward 22 - Hutha Colony', 'Ward 30 - Jannapura'] }]
      },
      {
        name: 'Sagara Taluk',
        cities: [{ name: 'Sagara CMC', wards: ['Ward 1 - Jog Falls Highway', 'Ward 6 - Marikamba Temple Area', 'Ward 12 - Subhash Nagar Sagara', 'Ward 19 - Keladi Heritage Road'] }]
      },
      {
        name: 'Shikaripura Taluk',
        cities: [{ name: 'Shikaripura TMC', wards: ['Ward 1 - Huchuraya Swamy Temple', 'Ward 5 - Shivappa Nayaka Circle', 'Ward 10 - Kaginele Road'] }]
      },
      {
        name: 'Soraba Taluk',
        cities: [{ name: 'Soraba TP', wards: ['Ward 1 - Ranganatha Temple', 'Ward 4 - Dandavati River Bank', 'Ward 7 - Anavatti Road'] }]
      },
      {
        name: 'Thirthahalli Taluk',
        cities: [{ name: 'Thirthahalli TP', wards: ['Ward 1 - Tunga River Rama Mantapa', 'Ward 4 - Kuvempu Memorial Kuppalli Road', 'Ward 7 - Soppugudde'] }]
      },
      {
        name: 'Hosanagara Taluk',
        cities: [{ name: 'Hosanagara TP', wards: ['Ward 1 - Sharavathi Backwaters View', 'Ward 3 - Ramachandrapura Matha Area', 'Ward 6 - Main Road'] }]
      }
    ]
  },
  {
    name: 'Tumakuru',
    taluks: [
      {
        name: 'Tumakuru City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Tumakuru City Corporation',
                wards: [
                  'Ward 3 - Siddaganga Matha Precinct',
                  'Ward 10 - B.H. Road Commercial Hub',
                  'Ward 18 - Sira Gate',
                  'Ward 27 - Batawadi',
                  'Ward 35 - Kyathsandra (Tatte Idli Hub)',
                  'Ward 42 - Ashok Nagar Tumkur'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Tumakuru City Corporation', wards: ['Siddaganga Matha', 'B.H. Road Commercial', 'Batawadi', 'Kyathsandra', 'Ashok Nagar'] }]
      },
      {
        name: 'Tiptur Taluk',
        cities: [{ name: 'Tiptur CMC', wards: ['Ward 2 - Copra (Dry Coconut) Market Yard', 'Ward 7 - K.R. Extension Tiptur', 'Ward 14 - Gandhinagar', 'Ward 21 - Halepet'] }]
      },
      {
        name: 'Sira Taluk',
        cities: [{ name: 'Sira TMC', wards: ['Ward 1 - Malik Rehan Dargah & Fort', 'Ward 5 - National Highway 48', 'Ward 11 - Kasturba Nagar'] }]
      },
      {
        name: 'Kunigal Taluk',
        cities: [{ name: 'Kunigal TMC', wards: ['Ward 1 - Kunigal Stud Farm Road', 'Ward 5 - Kunigal Doddakere (Large Lake)', 'Ward 10 - National Highway 75'] }]
      },
      {
        name: 'Madhugiri Taluk',
        cities: [{ name: 'Madhugiri TMC', wards: ['Ward 1 - Asia Largest Monolithic Fort Hill', 'Ward 5 - Dandina Maramma Temple', 'Ward 9 - Court Road'] }]
      },
      {
        name: 'Gubbi Taluk',
        cities: [{ name: 'Gubbi TP', wards: ['Ward 1 - Gubbi Thotadappa Area', 'Ward 4 - Gosala Channabasaveshwara Temple', 'Ward 7 - Station Road'] }]
      },
      {
        name: 'Chiknayakanhalli Taluk',
        cities: [{ name: 'Chiknayakanhalli TP', wards: ['Ward 1 - Mineral Mining Area', 'Ward 4 - Town Hall Circle', 'Ward 8 - Bus Stand'] }]
      },
      {
        name: 'Pavagada Taluk',
        cities: [{ name: 'Pavagada TP', wards: ['Ward 1 - Ultra Mega Solar Park Area', 'Ward 4 - Fort Hill', 'Ward 8 - Shani Mahatma Temple Area'] }]
      },
      {
        name: 'Koratagere Taluk',
        cities: [{ name: 'Koratagere TP', wards: ['Ward 1 - Goravanahalli Mahalakshmi Road', 'Ward 4 - Suvarnamukhi River Bank', 'Ward 7 - Main Market'] }]
      },
      {
        name: 'Turuvekere Taluk',
        cities: [{ name: 'Turuvekere TP', wards: ['Ward 1 - Chennigaraya Temple', 'Ward 3 - Moole Shankareshwara', 'Ward 6 - Bus Stand'] }]
      }
    ]
  },
  {
    name: 'Udupi',
    taluks: [
      {
        name: 'Udupi Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Udupi City Municipal Council',
                wards: [
                  'Ward 1 - Sri Krishna Matha Car Street',
                  'Ward 7 - Malpe Beach & Fishery Harbor',
                  'Ward 14 - Manipal University Town (MIT Campus)',
                  'Ward 22 - Kunjibettu',
                  'Ward 29 - Bannanje',
                  'Ward 35 - Santhekatte Kallianpur'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Udupi CMC', wards: ['Krishna Matha Car Street', 'Malpe Beach & Harbor', 'Manipal University Town', 'Kunjibettu', 'Bannanje'] }]
      },
      {
        name: 'Kundapura Taluk',
        cities: [{ name: 'Kundapura TMC', wards: ['Ward 1 - Kundeswara Temple Area', 'Ward 6 - Panchagangavali River Estuary', 'Ward 12 - Shastri Circle', 'Ward 18 - Koteshwara Heritage Road'] }]
      },
      {
        name: 'Karkala Taluk',
        cities: [{ name: 'Karkala TMC', wards: ['Ward 1 - Gommateshwara Monolith Hill', 'Ward 5 - St Lawrence Minor Basilica Attur', 'Ward 10 - Anekere Lake Area', 'Ward 16 - Market Road'] }]
      },
      {
        name: 'Kaup Taluk',
        cities: [{ name: 'Kaup TMC', wards: ['Ward 1 - Kaup Lighthouse Beach', 'Ward 4 - Marigudi Temple Precinct', 'Ward 8 - National Highway 66'] }]
      },
      {
        name: 'Brahmavara Taluk',
        cities: [{ name: 'Brahmavara TP', wards: ['Ward 1 - Agricultural Research Station Area', 'Ward 4 - Handadi', 'Ward 7 - National Highway Junction'] }]
      },
      {
        name: 'Byndoor Taluk',
        cities: [{ name: 'Byndoor TP', wards: ['Ward 1 - Someshwara Beach', 'Ward 4 - Railway Station', 'Ward 7 - Kollur Mookambika Gate'] }]
      },
      {
        name: 'Hebri Taluk',
        cities: [{ name: 'Hebri TP', wards: ['Ward 1 - Someshwara Wildlife Sanctuary Road', 'Ward 3 - Seetha River Bank', 'Ward 6 - Bus Stand'] }]
      }
    ]
  },
  {
    name: 'Uttara Kannada (Karwar)',
    taluks: [
      {
        name: 'Karwar Taluk',
        hoblis: [
          {
            name: 'Karwar Kasaba',
            cities: [
              {
                name: 'Karwar City Municipal Council',
                wards: ['Ward 1 - Rabindranath Tagore Beach', 'Ward 5 - INS Kadamba Naval Base Gate', 'Ward 11 - Kali River Bridge', 'Ward 18 - Baithkol Fishing Harbor', 'Ward 25 - Habbuwada']
              }
            ]
          }
        ],
        cities: [{ name: 'Karwar CMC', wards: ['Tagore Beach', 'Naval Base Gate', 'Kali Bridge', 'Baithkol Harbor'] }]
      },
      {
        name: 'Bhatkal Taluk',
        cities: [{ name: 'Bhatkal TMC', wards: ['Ward 2 - Murudeshwara Shiva Temple Precinct', 'Ward 7 - Old Port Fishery Area', 'Ward 14 - National Highway 66', 'Ward 20 - Bunder Road'] }]
      },
      {
        name: 'Sirsi Taluk',
        cities: [{ name: 'Sirsi CMC', wards: ['Ward 1 - Marikamba Temple Area', 'Ward 6 - Spices and Arecanut Market', 'Ward 12 - Banavasi Heritage Road', 'Ward 19 - Kakkalli Road'] }]
      },
      {
        name: 'Kumta Taluk',
        cities: [{ name: 'Kumta TMC', wards: ['Ward 1 - Aghanashini Estuary Area', 'Ward 5 - Beach Road', 'Ward 9 - Court Circle'] }]
      },
      {
        name: 'Ankola Taluk',
        cities: [{ name: 'Ankola TMC', wards: ['Ward 1 - Belekeri Port Approach', 'Ward 4 - Honey & Mango Market', 'Ward 8 - Bus Stand'] }]
      },
      {
        name: 'Honnavar Taluk',
        cities: [{ name: 'Honnavar TP', wards: ['Ward 1 - Sharavathi Railway Bridge View', 'Ward 4 - Eco Beach Kasarkod', 'Ward 8 - Port Road'] }]
      },
      {
        name: 'Dandeli Taluk',
        cities: [{ name: 'Dandeli CMC', wards: ['Ward 1 - Kali River Rafting Hub', 'Ward 5 - Paper Mill Colony', 'Ward 10 - Wildlife Sanctuary Gate'] }]
      },
      {
        name: 'Haliyal Taluk',
        cities: [{ name: 'Haliyal TP', wards: ['Ward 1 - Sugar Factory Road', 'Ward 4 - Shivaji Fort Area', 'Ward 7 - Main Market'] }]
      },
      {
        name: 'Siddapur Taluk',
        cities: [{ name: 'Siddapur TP', wards: ['Ward 1 - Burude Falls Road', 'Ward 3 - Arecanut Mandi', 'Ward 6 - Hospital Road'] }]
      },
      {
        name: 'Yellapur Taluk',
        cities: [{ name: 'Yellapur TP', wards: ['Ward 1 - Magod Falls Highway', 'Ward 4 - Forest Depot', 'Ward 7 - Main Chowk'] }]
      },
      {
        name: 'Joida Taluk',
        cities: [{ name: 'Joida (Supa) TP', wards: ['Ward 1 - Supa Dam Reservoir Road', 'Ward 3 - Hornbill Conservation Area', 'Ward 5 - Bus Stand'] }]
      },
      {
        name: 'Mundgod Taluk',
        cities: [{ name: 'Mundgod TP', wards: ['Ward 1 - Doeguling Tibetan Settlement', 'Ward 4 - Monastic University Area', 'Ward 7 - Market Street'] }]
      }
    ]
  },
  {
    name: 'Vijayapura',
    taluks: [
      {
        name: 'Vijayapura City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Vijayapura City Corporation',
                wards: [
                  'Ward 1 - Gol Gumbaz Monument Precinct',
                  'Ward 8 - Ibrahim Rauza',
                  'Ward 16 - Station Road Bijapur',
                  'Ward 24 - Gandhi Chowk',
                  'Ward 32 - Solapur Road',
                  'Ward 41 - Athani Naka',
                  'Ward 50 - Jala Nagar'
                ]
              }
            ]
          }
        ],
        cities: [{ name: 'Vijayapura City Corporation', wards: ['Gol Gumbaz Monument', 'Ibrahim Rauza', 'Gandhi Chowk', 'Station Road', 'Jala Nagar'] }]
      },
      {
        name: 'Basavana Bagewadi Taluk',
        cities: [{ name: 'Basavana Bagewadi TMC', wards: ['Ward 1 - Basaveshwara Birthplace Smarak', 'Ward 5 - Muddebihal Road', 'Ward 9 - Bus Stand Area'] }]
      },
      {
        name: 'Indi Taluk',
        cities: [{ name: 'Indi TMC', wards: ['Ward 1 - Lemon Mandi Yard', 'Ward 6 - Railway Junction Area', 'Ward 11 - Mahaveer Chowk'] }]
      },
      {
        name: 'Muddebihal Taluk',
        cities: [{ name: 'Muddebihal TMC', wards: ['Ward 1 - Durgamma Temple', 'Ward 5 - Court Road', 'Ward 10 - Talikoti Road'] }]
      },
      {
        name: 'Sindagi Taluk',
        cities: [{ name: 'Sindagi TMC', wards: ['Ward 1 - Shantaveera Matha', 'Ward 5 - Kalaburagi Road', 'Ward 10 - APMC Market'] }]
      },
      {
        name: 'Talikoti Taluk',
        cities: [{ name: 'Talikoti TMC', wards: ['Ward 1 - Historical Battleground Heritage Area', 'Ward 4 - Doni River Bank', 'Ward 8 - Main Market'] }]
      },
      {
        name: 'Chadchan Taluk',
        cities: [{ name: 'Chadchan TP', wards: ['Ward 1 - Textile Weavers Market', 'Ward 3 - Border Highway', 'Ward 6 - Gram Chowk'] }]
      }
    ]
  },
  {
    name: 'Vijayanagara (Hosapete)',
    taluks: [
      {
        name: 'Hosapete (Hospet) Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Hosapete City Municipal Council',
                wards: [
                  'Ward 2 - Tungabhadra Dam & Vaikuntha Guest House',
                  'Ward 8 - Hampi UNESCO Heritage Approach',
                  'Ward 15 - Station Road Hospet',
                  'Ward 23 - College Road',
                  'Ward 31 - Dam Road'
                ]
              }
            ]
          },
          {
            name: 'Kamalapura (Hampi Heritage)',
            cities: [
              {
                name: 'Hampi - Kamalapura Heritage Zone',
                wards: ['Virupaksha Temple Car Street', 'Vittala Temple Stone Chariot Precinct', 'Lotus Mahal & Elephant Stables', 'Royal Enclosure Ward']
              }
            ]
          }
        ],
        cities: [{ name: 'Hosapete CMC', wards: ['Tungabhadra Dam', 'Hampi Approach', 'Station Road Hospet', 'Dam Road'] }]
      },
      {
        name: 'Harapanahalli Taluk',
        cities: [{ name: 'Harapanahalli TMC', wards: ['Ward 1 - Fort Ward', 'Ward 5 - Kotturu Road', 'Ward 10 - Main Bus Stand Area'] }]
      },
      {
        name: 'Kotturu Taluk',
        cities: [{ name: 'Kotturu TMC', wards: ['Ward 1 - Guru Kottureshwara Temple Car Street', 'Ward 4 - Bellary Road', 'Ward 8 - Station Ward'] }]
      },
      {
        name: 'Hagaribommanahalli Taluk',
        cities: [{ name: 'H.B. Halli TMC', wards: ['Ward 1 - Malvi Dam Area', 'Ward 4 - Cotton Mandi', 'Ward 8 - Bus Stand'] }]
      },
      {
        name: 'Hoovina Hadagali Taluk',
        cities: [{ name: 'H. Hadagali TMC', wards: ['Ward 1 - Jasmine Flower Market Yard', 'Ward 4 - Tungabhadra Bank', 'Ward 8 - Court Circle'] }]
      },
      {
        name: 'Kudligi Taluk',
        cities: [{ name: 'Kudligi TP', wards: ['Ward 1 - Kottur Road', 'Ward 4 - Mahatma Gandhi Circle', 'Ward 7 - Hospital Ward'] }]
      }
    ]
  },
  {
    name: 'Yadgir',
    taluks: [
      {
        name: 'Yadgir City & Taluk',
        hoblis: [
          {
            name: 'Kasaba Hobli',
            cities: [
              {
                name: 'Yadgir City Municipal Council',
                wards: ['Ward 1 - Yadgir Hill Fort Area', 'Ward 6 - Railway Colony Yadgir', 'Ward 12 - Chittapur Road', 'Ward 19 - Ganj Area', 'Ward 26 - Hattikuni Dam Road']
              }
            ]
          }
        ],
        cities: [{ name: 'Yadgir CMC', wards: ['Yadgir Hill Fort', 'Railway Colony', 'Chittapur Road', 'Ganj Area'] }]
      },
      {
        name: 'Shahapur Taluk',
        cities: [{ name: 'Shahapur CMC', wards: ['Ward 1 - Sleeping Buddha Hill Area', 'Ward 6 - Kanakadasa Circle', 'Ward 12 - Shorapur Road'] }]
      },
      {
        name: 'Surpur (Shorapur) Taluk',
        cities: [{ name: 'Surpur TMC', wards: ['Ward 1 - Raja Venkatappa Nayaka Palace Area', 'Ward 5 - Taylor Manzil Heritage View', 'Ward 10 - Market Yard'] }]
      },
      {
        name: 'Gurmitkal Taluk',
        cities: [{ name: 'Gurmitkal TP', wards: ['Ward 1 - Khasbag', 'Ward 4 - Yanagundi Matha Road', 'Ward 7 - Border Road'] }]
      },
      {
        name: 'Hunsagi Taluk',
        cities: [{ name: 'Hunsagi TP', wards: ['Ward 1 - Stone Age Prehistoric Archaeological Site', 'Ward 4 - Canal Colony', 'Ward 7 - Main Market'] }]
      },
      {
        name: 'Wadagera Taluk',
        cities: [{ name: 'Wadagera TP', wards: ['Ward 1 - Grama Chowk', 'Ward 3 - Krishna Canal Ward', 'Ward 6 - Bus Stand'] }]
      }
    ]
  }
];

// Enrich any taluk that doesn't have explicit hoblis so that every taluk across Karnataka has complete hoblis and villages
export function enrichAllKarnatakaTaluks(districts: DistrictData[]): DistrictData[] {
  for (const d of districts) {
    for (const taluk of d.taluks) {
      const base = taluk.name.replace(/ Taluk$/i, '').replace(/ City & Taluk$/i, '');
      const mainCity = (taluk.cities && taluk.cities[0]) ? taluk.cities[0].name : `${base} Town`;
      const mainWards = (taluk.cities && taluk.cities[0] && taluk.cities[0].wards && taluk.cities[0].wards.length > 0)
        ? taluk.cities[0].wards
        : [
            'Ward 1 - Main Market / Bazaar',
            'Ward 2 - Bus Stand & Station Road',
            'Ward 3 - Temple / Gramatana Circle',
            'Ward 4 - Extension Colony'
          ];

      if (!taluk.hoblis || taluk.hoblis.length === 0) {
        taluk.hoblis = [
          {
            name: `${base} Kasaba Hobli (ಕಸಬಾ)`,
            cities: [
              { name: mainCity, wards: mainWards },
              { name: `${base} Rural Village (ಗ್ರಾಮ)`, wards: ['Gramatana Ward', 'Raita Samparka Ward', 'Government School Ward'] },
              { name: `${base} Extension Layout`, wards: ['1st Main Cross', '2nd Main Cross', 'Temple Road'] }
            ]
          },
          {
            name: `${base} North Hobli Circle (ಉತ್ತರ ಹೋಬಳಿ)`,
            cities: [
              { name: `${base} North Gram Panchayat`, wards: ['GP Ward 1 - Bazaar Galli', 'GP Ward 2 - Dairy Road'] },
              { name: `${base} Kere Village (ಕೆರೆ ಗ್ರಾಮ)`, wards: ['Lake Bund Ward', 'Maruti Temple Ward'] },
              { name: `${base} Halli Village`, wards: ['Old Village Ward', 'Community Hall Ward'] }
            ]
          },
          {
            name: `${base} South Hobli Circle (ದಕ್ಷಿಣ ಹೋಬಳಿ)`,
            cities: [
              { name: `${base} South Gram Panchayat`, wards: ['Main Road Ward', 'Agricultural Society Ward'] },
              { name: `${base} Koppa Village (ಕೊಪ್ಪ ಗ್ರಾಮ)`, wards: ['Primary Health Center Ward', 'Post Office Ward'] },
              { name: `${base} Thanda / Rural Settlement`, wards: ['Settlement Ward 1', 'Main Chowk'] }
            ]
          }
        ];
      }

      // Ensure taluk.cities includes all distinct cities/villages from all its hoblis
      const allVillages: CityOrTown[] = [];
      for (const h of taluk.hoblis) {
        for (const c of h.cities) {
          if (!allVillages.some(v => v.name.toLowerCase() === c.name.toLowerCase())) {
            allVillages.push(c);
          }
        }
      }
      taluk.cities = allVillages;
    }
  }
  return districts;
}

// Automatically enrich all districts upon module loading
enrichAllKarnatakaTaluks(ALL_31_KARNATAKA_DISTRICTS);

