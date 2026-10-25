import { Router, Request, Response } from 'express';
import { getDatabase, saveDatabase } from '../db.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../auth.js';
import { ALL_31_KARNATAKA_DISTRICTS } from '../data/karnatakaLocations.js';

const router = Router();

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

// Complete Karnataka Administrative Locations Dataset
export const COMPREHENSIVE_KARNATAKA_LOCATIONS = {
  state: 'Karnataka',
  districts: [
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
            },
            {
              name: 'Hesaraghatta Hobli',
              cities: [
                {
                  name: 'Hesaraghatta Rural / Suburbs',
                  wards: ['Ward 11 - Kuvempu Nagar', 'Ward 12 - Shettihalli', 'Ward 13 - Mallasandra']
                }
              ]
            }
          ],
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
          name: 'Bengaluru South',
          hoblis: [
            {
              name: 'Begur Hobli',
              cities: [
                {
                  name: 'BBMP South Zone',
                  wards: [
                    'Ward 143 - Visvesvarapuram',
                    'Ward 144 - Siddapura',
                    'Ward 150 - Bellandur',
                    'Ward 151 - Koramangala',
                    'Ward 167 - Jayanagar East',
                    'Ward 177 - JP Nagar 6th Phase',
                    'Ward 185 - Yelachenahalli'
                  ]
                }
              ]
            },
            {
              name: 'Uttarahalli Hobli',
              cities: [
                {
                  name: 'Uttarahalli / Banashankari Suburbs',
                  wards: ['Ward 160 - Rajarajeshwari Nagar', 'Ward 182 - Padmanabhanagar', 'Ward 184 - Uttarahalli']
                }
              ]
            },
            {
              name: 'Kengeri Hobli',
              cities: [
                {
                  name: 'Kengeri Satellite Town',
                  wards: ['Ward 159 - Kengeri', 'Ward 161 - Hosakerehalli', 'Ward 162 - Jnana Bharathi']
                }
              ]
            }
          ],
          cities: [
            {
              name: 'BBMP South Zone',
              wards: [
                'Ward 143 - Visvesvarapuram',
                'Ward 144 - Siddapura',
                'Ward 150 - Bellandur',
                'Ward 151 - Koramangala',
                'Ward 167 - Jayanagar East',
                'Ward 177 - JP Nagar',
                'Ward 182 - Padmanabhanagar'
              ]
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
                  name: 'BBMP East Zone (K.R. Puram)',
                  wards: ['Ward 51 - Vijinapura', 'Ward 52 - K.R. Puram', 'Ward 53 - Basavanapura', 'Ward 54 - Hoodi']
                }
              ]
            },
            {
              name: 'Varthur Hobli',
              cities: [
                {
                  name: 'BBMP Mahadevapura Zone (Whitefield)',
                  wards: ['Ward 80 - Hoysala Nagar (Indiranagar)', 'Ward 82 - Halasuru', 'Ward 84 - Hagadur (Whitefield)', 'Ward 85 - Doddanekkundi', 'Ward 112 - Domlur', 'Ward 149 - Varthur']
                }
              ]
            },
            {
              name: 'Bidarahalli Hobli',
              cities: [
                {
                  name: 'Bidarahalli Sub-Urban Ward',
                  wards: ['Ward 55 - Devasandra', 'Ward 56 - A. Narayanapura', 'Ward 86 - Marathahalli']
                }
              ]
            }
          ],
          cities: [
            {
              name: 'BBMP East Zone',
              wards: [
                'Ward 79 - Sarvagnanagar',
                'Ward 80 - Hoysala Nagar (Indiranagar)',
                'Ward 82 - Halasuru',
                'Ward 84 - Hagadur (Whitefield)',
                'Ward 85 - Doddanekkundi',
                'Ward 112 - Domlur'
              ]
            }
          ]
        },
        {
          name: 'Anekal',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Anekal Town Municipal Council',
                  wards: ['Ward 1 - Old Town', 'Ward 2 - Channakeshavanagar', 'Ward 3 - Market Area', 'Ward 4 - Court Road']
                }
              ]
            },
            {
              name: 'Attibele Hobli',
              cities: [
                {
                  name: 'Attibele / Electronic City Area',
                  wards: ['Ward 7 - Electronic City Phase 1', 'Ward 8 - Electronic City Phase 2', 'Ward 9 - Attibele Border']
                }
              ]
            },
            {
              name: 'Sarjapura Hobli',
              cities: [
                {
                  name: 'Sarjapura Township',
                  wards: ['Ward 5 - Sarjapur Main Road', 'Ward 6 - Sompura Industrial Gate']
                }
              ]
            },
            {
              name: 'Jigani Hobli',
              cities: [
                {
                  name: 'Jigani Industrial Area',
                  wards: ['Ward 8 - Jigani Industrial Area Phase 1', 'Ward 10 - APC Circle', 'Ward 11 - Bannerghatta Village']
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Anekal Town',
              wards: [
                'Ward 1 - Old Town',
                'Ward 3 - Market Area',
                'Ward 7 - Electronic City Phase 1',
                'Ward 8 - Jigani Industrial Area'
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Bengaluru Rural',
      taluks: [
        {
          name: 'Devanahalli',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Devanahalli Town', wards: ['Ward 1 - Fort Road', 'Ward 2 - Airport Road', 'Ward 3 - Bus Stand Area'] }]
            },
            {
              name: 'Vijayapura Hobli',
              cities: [{ name: 'Vijayapura Town', wards: ['Ward 1 - Market Circle', 'Ward 2 - Hospital Road'] }]
            }
          ],
          cities: [{ name: 'Devanahalli Town', wards: ['Ward 1 - Fort Road', 'Ward 2 - Airport Road', 'Ward 3 - Bus Stand Area'] }]
        },
        {
          name: 'Doddaballapura',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Doddaballapura Town', wards: ['Ward 1 - Weavers Colony', 'Ward 2 - Railway Station Road', 'Ward 5 - Industrial Area'] }]
            }
          ],
          cities: [{ name: 'Doddaballapura Town', wards: ['Ward 1 - Weavers Colony', 'Ward 2 - Railway Station Road'] }]
        },
        {
          name: 'Hosakote',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Hosakote Town', wards: ['Ward 1 - Toll Gate Area', 'Ward 2 - Main Bazaar', 'Ward 4 - Auto Stand'] }]
            }
          ],
          cities: [{ name: 'Hosakote Town', wards: ['Ward 1 - Toll Gate Area', 'Ward 2 - Main Bazaar'] }]
        },
        {
          name: 'Nelamangala',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Nelamangala Town', wards: ['Ward 1 - NH4 Junction', 'Ward 3 - Subhash Nagar', 'Ward 6 - Sondekoppa Road'] }]
            }
          ],
          cities: [{ name: 'Nelamangala Town', wards: ['Ward 1 - NH4 Junction', 'Ward 3 - Subhash Nagar'] }]
        }
      ]
    },
    {
      name: 'Mysuru',
      taluks: [
        {
          name: 'Mysuru Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli (Mysuru North)',
              cities: [
                {
                  name: 'Mysuru City Corporation',
                  wards: [
                    'Ward 12 - Chamundipuram',
                    'Ward 24 - Kuvempunagar',
                    'Ward 31 - Saraswathipuram',
                    'Ward 40 - Gokulam 3rd Stage',
                    'Ward 52 - Vijayanagar 2nd Stage',
                    'Ward 60 - Hebbal Industrial Area',
                    'Ward 65 - Devaraja Mohalla'
                  ]
                }
              ]
            },
            {
              name: 'Varuna Hobli',
              cities: [
                {
                  name: 'Varuna Sub-Division',
                  wards: ['Ward 5 - Varuna Cross', 'Ward 8 - Siddalingapura', 'Ward 9 - Lalithadripura']
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Mysuru City Corporation',
              wards: [
                'Ward 12 - Chamundipuram',
                'Ward 24 - Kuvempunagar',
                'Ward 31 - Saraswathipuram',
                'Ward 40 - Gokulam',
                'Ward 52 - Vijayanagar 2nd Stage'
              ]
            }
          ]
        },
        {
          name: 'Nanjangud',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Nanjangud Town', wards: ['Ward 3 - Temple Road', 'Ward 5 - Industrial Area', 'Ward 9 - Bazaar Street'] }]
            }
          ],
          cities: [{ name: 'Nanjangud Town', wards: ['Ward 3 - Temple Road', 'Ward 5 - Industrial Area'] }]
        },
        {
          name: 'Hunsur',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Hunsur Town', wards: ['Ward 1 - Bypass Road', 'Ward 4 - Old Bus Stand', 'Ward 7 - Timber Yard'] }]
            }
          ],
          cities: [{ name: 'Hunsur Town', wards: ['Ward 1 - Bypass Road', 'Ward 4 - Old Bus Stand'] }]
        }
      ]
    },
    {
      name: 'Mangaluru (Dakshina Kannada)',
      taluks: [
        {
          name: 'Mangaluru',
          hoblis: [
            {
              name: 'Mangaluru Kasaba',
              cities: [
                {
                  name: 'Mangaluru City Corporation',
                  wards: [
                    'Ward 14 - Kadri South',
                    'Ward 22 - Bejai',
                    'Ward 28 - Mannagudda',
                    'Ward 35 - Hampankatta',
                    'Ward 42 - Pandeshwar',
                    'Ward 48 - Bunder Port Area',
                    'Ward 55 - Kankanady'
                  ]
                }
              ]
            },
            {
              name: 'Surathkal Hobli',
              cities: [
                {
                  name: 'Surathkal Sub-Division',
                  wards: ['Ward 1 - Surathkal West', 'Ward 2 - NITK Beach Area', 'Ward 4 - Baikampady Industrial']
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Mangaluru City Corporation',
              wards: [
                'Ward 14 - Kadri South',
                'Ward 22 - Bejai',
                'Ward 28 - Mannagudda',
                'Ward 35 - Hampankatta',
                'Ward 42 - Pandeshwar'
              ]
            }
          ]
        },
        {
          name: 'Bantwal',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Bantwal Town', wards: ['Ward 1 - B.C. Road', 'Ward 2 - Kaikamba', 'Ward 5 - Netravati Riverbank'] }]
            }
          ],
          cities: [{ name: 'Bantwal Town', wards: ['Ward 1 - B.C. Road', 'Ward 2 - Kaikamba'] }]
        },
        {
          name: 'Puttur',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Puttur City Municipality', wards: ['Ward 1 - Darbe', 'Ward 3 - Main Road', 'Ward 8 - Bolwar'] }]
            }
          ],
          cities: [{ name: 'Puttur City Municipality', wards: ['Ward 1 - Darbe', 'Ward 3 - Main Road'] }]
        }
      ]
    },
    {
      name: 'Hubballi-Dharwad',
      taluks: [
        {
          name: 'Hubballi Urban',
          hoblis: [
            {
              name: 'Hubballi Kasaba',
              cities: [
                {
                  name: 'Hubballi-Dharwad Municipal Corp',
                  wards: [
                    'Ward 15 - Vidyanagar',
                    'Ward 21 - Keshwapur',
                    'Ward 33 - Bhavani Nagar',
                    'Ward 48 - Station Road',
                    'Ward 56 - Unkal Lake Area',
                    'Ward 62 - Gokul Road Industrial'
                  ]
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Hubballi-Dharwad Municipal Corp',
              wards: [
                'Ward 15 - Vidyanagar',
                'Ward 21 - Keshwapur',
                'Ward 33 - Bhavani Nagar',
                'Ward 48 - Station Road'
              ]
            }
          ]
        },
        {
          name: 'Dharwad Urban',
          hoblis: [
            {
              name: 'Dharwad Kasaba',
              cities: [
                {
                  name: 'Dharwad City Division',
                  wards: ['Ward 1 - Sadhankeri', 'Ward 5 - Malmaddi', 'Ward 9 - Saptapur', 'Ward 14 - Kaginele Road']
                }
              ]
            }
          ],
          cities: [{ name: 'Dharwad City Division', wards: ['Ward 1 - Sadhankeri', 'Ward 5 - Malmaddi', 'Ward 9 - Saptapur'] }]
        }
      ]
    },
    {
      name: 'Belagavi',
      taluks: [
        {
          name: 'Belagavi Urban',
          hoblis: [
            {
              name: 'Belagavi Kasaba',
              cities: [
                {
                  name: 'Belagavi City Corporation',
                  wards: [
                    'Ward 10 - Tilakwadi',
                    'Ward 18 - Camp Area',
                    'Ward 25 - Shahapur',
                    'Ward 32 - Vadgaon',
                    'Ward 41 - Angol',
                    'Ward 50 - Udyambag Industrial'
                  ]
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Belagavi City Corporation',
              wards: ['Ward 10 - Tilakwadi', 'Ward 18 - Camp Area', 'Ward 25 - Shahapur', 'Ward 32 - Vadgaon']
            }
          ]
        },
        {
          name: 'Gokak',
          hoblis: [
            {
              name: 'Gokak Kasaba',
              cities: [{ name: 'Gokak Town', wards: ['Ward 1 - Falls Road', 'Ward 3 - Mill Area', 'Ward 7 - Market Street'] }]
            }
          ],
          cities: [{ name: 'Gokak Town', wards: ['Ward 1 - Falls Road', 'Ward 3 - Mill Area'] }]
        }
      ]
    },
    {
      name: 'Tumakuru',
      taluks: [
        {
          name: 'Tumakuru Urban',
          hoblis: [
            {
              name: 'Tumakuru Kasaba',
              cities: [
                {
                  name: 'Tumakuru City Corporation',
                  wards: [
                    'Ward 5 - SIT Extension',
                    'Ward 12 - Ashok Nagar',
                    'Ward 18 - Kyatsandra',
                    'Ward 22 - Mandipet',
                    'Ward 28 - Batawadi',
                    'Ward 35 - Gulpet'
                  ]
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Tumakuru City Corporation',
              wards: ['Ward 5 - SIT Extension', 'Ward 12 - Ashok Nagar', 'Ward 18 - Kyatsandra', 'Ward 22 - Mandipet']
            }
          ]
        },
        {
          name: 'Tiptur',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Tiptur Town', wards: ['Ward 1 - Copra Market', 'Ward 3 - Station Circle', 'Ward 6 - College Road'] }]
            }
          ],
          cities: [{ name: 'Tiptur Town', wards: ['Ward 1 - Copra Market', 'Ward 3 - Station Circle'] }]
        }
      ]
    },
    {
      name: 'Kalaburagi',
      taluks: [
        {
          name: 'Kalaburagi Urban',
          hoblis: [
            {
              name: 'Kalaburagi Kasaba',
              cities: [
                {
                  name: 'Kalaburagi City Corporation',
                  wards: [
                    'Ward 4 - Brahmpur',
                    'Ward 11 - Super Market Area',
                    'Ward 23 - Station Bazaar',
                    'Ward 31 - Sedam Road',
                    'Ward 42 - MSK Mill Area'
                  ]
                }
              ]
            }
          ],
          cities: [
            {
              name: 'Kalaburagi City Corporation',
              wards: ['Ward 4 - Brahmpur', 'Ward 11 - Super Market Area', 'Ward 23 - Station Bazaar', 'Ward 31 - Sedam Road']
            }
          ]
        }
      ]
    },
    {
      name: 'Shivamogga',
      taluks: [
        {
          name: 'Shivamogga Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Shivamogga City Corporation',
                  wards: ['Ward 8 - Gandhi Bazaar', 'Ward 15 - Durgigudi', 'Ward 22 - Vinobhanagar', 'Ward 29 - Sharavathi Nagar']
                }
              ]
            }
          ],
          cities: [{ name: 'Shivamogga City Corporation', wards: ['Ward 8 - Gandhi Bazaar', 'Ward 15 - Durgigudi', 'Ward 22 - Vinobhanagar'] }]
        },
        {
          name: 'Bhadravathi',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [{ name: 'Bhadravathi City Municipality', wards: ['Ward 2 - Paper Town', 'Ward 5 - VISL Steel Plant Gate', 'Ward 9 - Old Town'] }]
            }
          ],
          cities: [{ name: 'Bhadravathi City Municipality', wards: ['Ward 2 - Paper Town', 'Ward 5 - VISL Steel Plant Gate'] }]
        }
      ]
    },
    {
      name: 'Ballari',
      taluks: [
        {
          name: 'Ballari Urban',
          hoblis: [
            {
              name: 'Ballari Kasaba',
              cities: [
                {
                  name: 'Ballari City Corporation',
                  wards: ['Ward 3 - Brucepet', 'Ward 12 - Cowl Bazaar', 'Ward 21 - Cantonment', 'Ward 30 - Gugrahatti']
                }
              ]
            }
          ],
          cities: [{ name: 'Ballari City Corporation', wards: ['Ward 3 - Brucepet', 'Ward 12 - Cowl Bazaar', 'Ward 21 - Cantonment'] }]
        }
      ]
    },
    {
      name: 'Udupi',
      taluks: [
        {
          name: 'Udupi Urban',
          hoblis: [
            {
              name: 'Udupi Kasaba',
              cities: [
                {
                  name: 'Udupi City Municipality',
                  wards: ['Ward 5 - Car Street (Temple Area)', 'Ward 12 - Manipal University Campus', 'Ward 18 - Malpe Port', 'Ward 24 - Kunjibettu']
                }
              ]
            }
          ],
          cities: [{ name: 'Udupi City Municipality', wards: ['Ward 5 - Car Street', 'Ward 12 - Manipal Campus', 'Ward 18 - Malpe Port'] }]
        }
      ]
    },
    {
      name: 'Hassan',
      taluks: [
        {
          name: 'Hassan Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Hassan City Municipality',
                  wards: ['Ward 4 - Shankarmutt Road', 'Ward 10 - BM Road', 'Ward 19 - Vidyanagar', 'Ward 25 - Dairy Circle']
                }
              ]
            }
          ],
          cities: [{ name: 'Hassan City Municipality', wards: ['Ward 4 - Shankarmutt Road', 'Ward 10 - BM Road', 'Ward 19 - Vidyanagar'] }]
        }
      ]
    },
    {
      name: 'Mandya',
      taluks: [
        {
          name: 'Mandya Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Mandya City Municipality',
                  wards: ['Ward 2 - Sugar Town', 'Ward 7 - Ashok Nagar', 'Ward 14 - Subhash Nagar', 'Ward 21 - Railway Station Road']
                }
              ]
            }
          ],
          cities: [{ name: 'Mandya City Municipality', wards: ['Ward 2 - Sugar Town', 'Ward 7 - Ashok Nagar'] }]
        }
      ]
    },
    {
      name: 'Davanagere',
      taluks: [
        {
          name: 'Davanagere Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Davanagere City Corporation',
                  wards: ['Ward 6 - MCC Block A', 'Ward 15 - Mandipet Cotton Market', 'Ward 24 - Vidyanagar', 'Ward 33 - Shamanur Road']
                }
              ]
            }
          ],
          cities: [{ name: 'Davanagere City Corporation', wards: ['Ward 6 - MCC Block A', 'Ward 15 - Mandipet Cotton Market', 'Ward 24 - Vidyanagar'] }]
        }
      ]
    },
    {
      name: 'Bagalkote',
      taluks: [
        {
          name: 'Bagalkote Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Bagalkote City Municipality',
                  wards: ['Ward 3 - Vidyagiri', 'Ward 8 - Old Town Market', 'Ward 14 - Kaulpet', 'Ward 22 - Station Road']
                },
                {
                  name: 'Navanagar Township',
                  wards: ['Sector 1 - Administration', 'Sector 10 - Commercial Complex', 'Sector 25 - Residential Layout', 'Sector 42 - Extension']
                }
              ]
            }
          ],
          cities: [
            { name: 'Bagalkote City Municipality', wards: ['Ward 3 - Vidyagiri', 'Ward 8 - Old Town Market', 'Ward 14 - Kaulpet', 'Ward 22 - Station Road'] },
            { name: 'Navanagar Township', wards: ['Sector 1 - Administration', 'Sector 10 - Commercial Complex', 'Sector 25 - Residential Layout'] },
            { name: 'Simikeri Village', wards: ['Grama Panchayat Ward 1', 'Main Village Street'] },
            { name: 'Muchakhandi Village', wards: ['Tank Road', 'Village Square'] }
          ]
        },
        {
          name: 'Badami',
          hoblis: [
            {
              name: 'Badami Rural Hobli',
              cities: [
                {
                  name: 'Badami Heritage Town',
                  wards: ['Ward 1 - Cave Temples Road', 'Ward 4 - Agastya Lake Bed', 'Ward 7 - Fort View', 'Ward 11 - Station Road']
                },
                {
                  name: 'Pattadakal Heritage Village',
                  wards: ['UNESCO Temple Complex Area', 'Grama Chawadi Ward']
                },
                {
                  name: 'Aihole Village',
                  wards: ['Durga Temple Street', 'Kempagudi Ward']
                }
              ]
            }
          ],
          cities: [
            { name: 'Badami Heritage Town', wards: ['Ward 1 - Cave Temples Road', 'Ward 4 - Agastya Lake Bed', 'Ward 7 - Fort View'] },
            { name: 'Pattadakal Village', wards: ['Temple Perimeter Road', 'Main Bazaar Street'] },
            { name: 'Aihole Village', wards: ['Archaeological Layout', 'Village Chawadi'] }
          ]
        },
        {
          name: 'Jamkhandi',
          hoblis: [
            {
              name: 'Jamkhandi Kasaba',
              cities: [
                {
                  name: 'Jamkhandi City Municipality',
                  wards: ['Ward 2 - Palace Road', 'Ward 5 - Cotton Market', 'Ward 9 - Girinagar', 'Ward 18 - Kankanawadi Gate']
                }
              ]
            }
          ],
          cities: [
            { name: 'Jamkhandi City Municipality', wards: ['Ward 2 - Palace Road', 'Ward 5 - Cotton Market', 'Ward 9 - Girinagar'] },
            { name: 'Rabkavi Banhatti Town', wards: ['Ward 3 - Weaver Colony', 'Ward 8 - Gandhi Chowk', 'Ward 15 - Rampur'] }
          ]
        },
        {
          name: 'Mudhol',
          cities: [
            { name: 'Mudhol City Municipality', wards: ['Ward 1 - Ranna Circle', 'Ward 6 - Court Road', 'Ward 12 - Ghalpuji Galli'] },
            { name: 'Lokapur Town', wards: ['Lime Kiln Area', 'Market Street'] }
          ]
        },
        {
          name: 'Hungund',
          cities: [
            { name: 'Hungund Town', wards: ['Ward 1 - Bus Stand Road', 'Ward 5 - Sangameshwara Colony'] },
            { name: 'Ilkal Saree Town', wards: ['Ward 2 - Saree Market', 'Ward 7 - Kanti Circle', 'Ward 14 - Koli Galli'] }
          ]
        },
        {
          name: 'Bilagi',
          cities: [
            { name: 'Bilagi Town', wards: ['Ward 1 - Siddeshwara Temple Road', 'Ward 4 - Galagali Road'] },
            { name: 'Galagali Village', wards: ['Krishna River Bank', 'Main Chawadi'] }
          ]
        }
      ]
    },
    {
      name: 'Bidar',
      taluks: [
        {
          name: 'Bidar Urban',
          hoblis: [
            {
              name: 'Bidar Kasaba',
              cities: [
                {
                  name: 'Bidar City Municipal Corporation',
                  wards: ['Ward 4 - Bidar Fort Area', 'Ward 9 - Gumpa Road', 'Ward 15 - Shivnagar', 'Ward 24 - Old City Market', 'Ward 31 - Mailoor']
                }
              ]
            }
          ],
          cities: [
            { name: 'Bidar City Municipal Corporation', wards: ['Ward 4 - Bidar Fort Area', 'Ward 9 - Gumpa Road', 'Ward 15 - Shivnagar', 'Ward 24 - Old City Market'] },
            { name: 'Mailoor Suburb', wards: ['Mailoor Extension', 'Guru Nanak Nagar'] },
            { name: 'Janwada Village', wards: ['Grama Panchayat Ward 1', 'Weekly Market Road'] }
          ]
        },
        {
          name: 'Basavakalyan',
          cities: [
            { name: 'Basavakalyan City Municipality', wards: ['Ward 2 - Fort Road', 'Ward 7 - Anubhava Mantapa', 'Ward 12 - Basaveshwara Circle'] },
            { name: 'Tripurant Village', wards: ['Temple Street', 'Lake Road'] }
          ]
        },
        {
          name: 'Bhalki',
          cities: [
            { name: 'Bhalki Town Municipality', wards: ['Ward 3 - Hiremath Area', 'Ward 8 - Shivaji Chowk', 'Ward 14 - Station Road'] },
            { name: 'Khatak Chincholi Village', wards: ['Grama Ward 1', 'Sugar Factory Road'] }
          ]
        },
        {
          name: 'Humnabad',
          cities: [
            { name: 'Humnabad Town Municipality', wards: ['Ward 1 - Manik Prabhu Temple Area', 'Ward 6 - National Highway Road', 'Ward 11 - Janata Colony'] }
          ]
        },
        {
          name: 'Aurad',
          cities: [
            { name: 'Aurad Town', wards: ['Ward 1 - Court Road', 'Ward 5 - Bus Stand Circle'] },
            { name: 'Kamalnagar Town', wards: ['Station Road', 'Bazaar Galli'] }
          ]
        }
      ]
    },
    {
      name: 'Chamarajanagar',
      taluks: [
        {
          name: 'Chamarajanagar Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Chamarajanagar City Municipality',
                  wards: ['Ward 3 - B.R. Hills Road', 'Ward 8 - Santhemarahalli Circle', 'Ward 15 - Ramasamudra', 'Ward 22 - Court Road']
                }
              ]
            }
          ],
          cities: [
            { name: 'Chamarajanagar City Municipality', wards: ['Ward 3 - B.R. Hills Road', 'Ward 8 - Santhemarahalli Circle', 'Ward 15 - Ramasamudra'] },
            { name: 'Kuderu Village', wards: ['Main Grama Street', 'School Road'] },
            { name: 'Haradanahalli Village', wards: ['Temple Road', 'Farmers Market'] }
          ]
        },
        {
          name: 'Kollegal',
          cities: [
            { name: 'Kollegal Silk Town Municipality', wards: ['Ward 2 - Silk Weavers Colony', 'Ward 6 - Southern Extension', 'Ward 13 - Malai Mahadeshwara Road'] },
            { name: 'Hanur Town', wards: ['Ward 1 - Bus Stand Road', 'Ward 4 - Forest Checkpost Road'] },
            { name: 'Male Mahadeshwara Hills (MM Hills)', wards: ['Pilgrim Complex', 'Temple Car Street'] }
          ]
        },
        {
          name: 'Gundlupet',
          cities: [
            { name: 'Gundlupet Town Municipality', wards: ['Ward 1 - Bandipur Highway Road', 'Ward 5 - Market Road', 'Ward 10 - Vijayapura Extension'] },
            { name: 'Hangala Village', wards: ['Bandipur Eco Gate Area', 'Village Main Road'] },
            { name: 'Gopalaswamy Hills Foot Village', wards: ['Hill Road', 'Temple Base'] }
          ]
        },
        {
          name: 'Yelandur',
          cities: [
            { name: 'Yelandur Town', wards: ['Ward 1 - Gaurishwara Temple Street', 'Ward 3 - B.R. Hills Route'] },
            { name: 'Biligirirangana Betta (BR Hills)', wards: ['Soliga Tribal Settlement Area', 'Temple Road'] }
          ]
        }
      ]
    },
    {
      name: 'Chikkaballapura',
      taluks: [
        {
          name: 'Chikkaballapura Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Chikkaballapura City Municipal Council',
                  wards: ['Ward 2 - BB Road', 'Ward 7 - MG Road', 'Ward 14 - Prashanth Nagar', 'Ward 21 - Kandavara Lake Bed']
                }
              ]
            },
            {
              name: 'Nandi Hobli',
              cities: [
                {
                  name: 'Nandi Village & Hills',
                  wards: ['Bhoganandishwara Temple Road', 'Nandi Hills Base Road', 'Gramatana Ward']
                },
                {
                  name: 'Muddenahalli Village',
                  wards: ['Sir MV Memorial Layout', 'Sathya Sai Grama']
                }
              ]
            }
          ],
          cities: [
            { name: 'Chikkaballapura City Municipal Council', wards: ['Ward 2 - BB Road', 'Ward 7 - MG Road', 'Ward 14 - Prashanth Nagar'] },
            { name: 'Nandi Village', wards: ['Bhoganandishwara Temple Road', 'Nandi Hills Base Road'] },
            { name: 'Muddenahalli', wards: ['Sir MV Museum Road', 'Educational Campus Ward'] }
          ]
        },
        {
          name: 'Chintamani',
          cities: [
            { name: 'Chintamani City Municipality', wards: ['Ward 1 - Tomato APMC Market', 'Ward 6 - Silk Market Road', 'Ward 12 - Chelur Road', 'Ward 19 - Double Road'] },
            { name: 'Murugamalla Village', wards: ['Dargah Perimeter Road', 'Village Center'] }
          ]
        },
        {
          name: 'Gauribidanur',
          cities: [
            { name: 'Gauribidanur Town Municipality', wards: ['Ward 2 - Railway Colony', 'Ward 8 - Market Road', 'Ward 15 - Sugar Factory Road'] },
            { name: 'Vidurashwatha Heritage Village', wards: ['Memorial Garden Road', 'Nagara Temple Street'] }
          ]
        },
        {
          name: 'Sidlaghatta',
          cities: [
            { name: 'Sidlaghatta Town Municipality', wards: ['Ward 1 - Raw Silk Cocoon Market', 'Ward 5 - Fort Area', 'Ward 11 - Jangamakote Cross'] }
          ]
        },
        {
          name: 'Bagepalli',
          cities: [
            { name: 'Bagepalli Town', wards: ['Ward 1 - National Highway 44', 'Ward 4 - Market Street', 'Ward 8 - Chelur Road'] }
          ]
        },
        {
          name: 'Gudibande',
          cities: [
            { name: 'Gudibande Town', wards: ['Ward 1 - Fort Base Road', 'Ward 3 - Tank Bund Road'] }
          ]
        }
      ]
    },
    {
      name: 'Chikkamagaluru',
      taluks: [
        {
          name: 'Chikkamagaluru Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Chikkamagaluru City Municipal Council',
                  wards: ['Ward 3 - MG Road', 'Ward 8 - Indira Gandhi Road', 'Ward 15 - Shankar Mutt Road', 'Ward 24 - Rathnagiri Bore', 'Ward 30 - Housing Board']
                }
              ]
            }
          ],
          cities: [
            { name: 'Chikkamagaluru City Municipal Council', wards: ['Ward 3 - MG Road', 'Ward 8 - Indira Gandhi Road', 'Ward 15 - Shankar Mutt Road'] },
            { name: 'Mullayanagiri Foothills Village', wards: ['Sitalayanagiri Road', 'Coffee Estate Settlement'] },
            { name: 'Bababudangiri Village', wards: ['Dattatreya Peetha Road', 'Attigundi Junction'] }
          ]
        },
        {
          name: 'Sringeri',
          cities: [
            { name: 'Sringeri Temple Town', wards: ['Ward 1 - Sharada Peetham Ratha Beedi', 'Ward 3 - Tunga River Ghat', 'Ward 6 - Bharathi Street'] },
            { name: 'Kigga Village', wards: ['Rishyasringa Temple Area', 'Grama Chawadi'] }
          ]
        },
        {
          name: 'Mudigere',
          cities: [
            { name: 'Mudigere Town', wards: ['Ward 1 - Coffee Planters Road', 'Ward 4 - Bus Stand Circle', 'Ward 8 - Handpost'] },
            { name: 'Kottigehara Village', wards: ['Charmadi Ghat Entry Point', 'Tea Estate Ward'] },
            { name: 'Kalasa Temple Town', wards: ['Kalaseshwara Temple Street', 'Bhadra River Bank'] }
          ]
        },
        {
          name: 'Kadur',
          cities: [
            { name: 'Kadur Town Municipality', wards: ['Ward 2 - Station Road', 'Ward 7 - Market Road', 'Ward 12 - Birur Gate'] },
            { name: 'Birur Junction Town', wards: ['Railway Station Area', 'Main Bazaar Street'] }
          ]
        },
        {
          name: 'Tarikere',
          cities: [
            { name: 'Tarikere Town Municipality', wards: ['Ward 1 - Kemmannugundi Road', 'Ward 6 - Old Town', 'Ward 11 - Gandhi Chowk'] },
            { name: 'Kemmannugundi Hill Settlement', wards: ['Horticulture Garden Area', 'Z Point Base'] }
          ]
        },
        {
          name: 'Koppa',
          cities: [
            { name: 'Koppa Town', wards: ['Ward 1 - Sahyadri Road', 'Ward 3 - Main Bazaar'] }
          ]
        },
        {
          name: 'Narasimharajapura (NR Pura)',
          cities: [
            { name: 'NR Pura Town', wards: ['Ward 1 - Convent Road', 'Ward 4 - Bus Stand Road'] },
            { name: 'Balehonnur Town', wards: ['Rambhapuri Mutt Area', 'Bhadra Bridge Road'] }
          ]
        }
      ]
    },
    {
      name: 'Chitradurga',
      taluks: [
        {
          name: 'Chitradurga Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Chitradurga City Municipal Council',
                  wards: ['Ward 2 - Seven-Ring Fort Gate', 'Ward 7 - BD Road', 'Ward 14 - Medehalli Road', 'Ward 21 - Nehru Nagar', 'Ward 28 - Holalkere Road']
                }
              ]
            }
          ],
          cities: [
            { name: 'Chitradurga City Municipal Council', wards: ['Ward 2 - Seven-Ring Fort Gate', 'Ward 7 - BD Road', 'Ward 14 - Medehalli Road'] },
            { name: 'Ingaladhal Village', wards: ['Copper Mines Area', 'Grama Chawadi'] },
            { name: 'Sirigere Village', wards: ['Taralabalu Bruhanmath Road', 'Main Village Street'] }
          ]
        },
        {
          name: 'Challakere',
          cities: [
            { name: 'Challakere Oil City Municipality', wards: ['Ward 1 - Groundnut Oil Mills Road', 'Ward 6 - Bellary Road', 'Ward 12 - Science City Road (BARC/ISRO)'] },
            { name: 'Kudapura Science City Village', wards: ['DRDO Complex Perimeter', 'ISRO Outer Gate'] }
          ]
        },
        {
          name: 'Hiriyur',
          cities: [
            { name: 'Hiriyur Town Municipality', wards: ['Ward 2 - National Highway 48', 'Ward 7 - Taralabalu Layout', 'Ward 13 - Sugar Factory Road'] },
            { name: 'Vani Vilasa Sagara Village', wards: ['Mari Kanive Dam Area', 'Fisheries Colony'] }
          ]
        },
        {
          name: 'Holalkere',
          cities: [
            { name: 'Holalkere Town', wards: ['Ward 1 - Ganapathi Temple Street', 'Ward 5 - Railway Station Road'] }
          ]
        },
        {
          name: 'Hosadurga',
          cities: [
            { name: 'Hosadurga Town Municipality', wards: ['Ward 2 - Cement Factory Road', 'Ward 8 - Market Road'] }
          ]
        },
        {
          name: 'Molakalmuru',
          cities: [
            { name: 'Molakalmuru Silk Saree Town', wards: ['Ward 1 - Weaver Street', 'Ward 4 - Fort Base Road'] }
          ]
        }
      ]
    },
    {
      name: 'Gadag',
      taluks: [
        {
          name: 'Gadag-Betageri',
          hoblis: [
            {
              name: 'Gadag Kasaba',
              cities: [
                {
                  name: 'Gadag-Betageri City Municipal Council',
                  wards: ['Ward 4 - Tontadarya Mutt Area', 'Ward 9 - Station Road', 'Ward 16 - Betageri Weavers Colony', 'Ward 23 - Pala Badami Road', 'Ward 32 - Mulgund Naka']
                }
              ]
            }
          ],
          cities: [
            { name: 'Gadag-Betageri City Municipal Council', wards: ['Ward 4 - Tontadarya Mutt Area', 'Ward 9 - Station Road', 'Ward 16 - Betageri Weavers Colony'] },
            { name: 'Binkadakatti Village', wards: ['Zoological Park Road', 'Grama Panchayat Ward 1'] },
            { name: 'Dambal Heritage Village', wards: ['Dodda Basappa Temple Area', 'Dambal Lake Road'] }
          ]
        },
        {
          name: 'Lakshmeshwar',
          cities: [
            { name: 'Lakshmeshwar Heritage Town', wards: ['Ward 1 - Someshwara Temple Street', 'Ward 5 - Jinarathna Complex', 'Ward 10 - Cotton Market'] }
          ]
        },
        {
          name: 'Nargund',
          cities: [
            { name: 'Nargund Town Municipality', wards: ['Ward 2 - Baba Saheb Fort Road', 'Ward 6 - Farmers Rebellion Circle', 'Ward 11 - Hubballi Road'] }
          ]
        },
        {
          name: 'Gajendragad',
          cities: [
            { name: 'Gajendragad Town', wards: ['Ward 1 - Hill Fort Area', 'Ward 4 - Handloom Weavers Colony', 'Ward 9 - APMC Yard'] }
          ]
        },
        {
          name: 'Ron',
          cities: [
            { name: 'Ron Town', wards: ['Ward 1 - Court Road', 'Ward 4 - Badami Road'] }
          ]
        },
        {
          name: 'Shirahatti',
          cities: [
            { name: 'Shirahatti Town', wards: ['Ward 1 - Fakireshwar Mutt Road', 'Ward 4 - Market Street'] }
          ]
        },
        {
          name: 'Mundargi',
          cities: [
            { name: 'Mundargi Town', wards: ['Ward 1 - Kappatagudda Road', 'Ward 5 - Tungabhadra Bank Area'] }
          ]
        }
      ]
    },
    {
      name: 'Haveri',
      taluks: [
        {
          name: 'Haveri Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Haveri City Municipal Council',
                  wards: ['Ward 3 - PB Road', 'Ward 8 - Siddheshwara Temple Area', 'Ward 14 - Vidyanagar', 'Ward 21 - Shivaji Nagar']
                }
              ]
            }
          ],
          cities: [
            { name: 'Haveri City Municipal Council', wards: ['Ward 3 - PB Road', 'Ward 8 - Siddheshwara Temple Area', 'Ward 14 - Vidyanagar'] },
            { name: 'Devagiri Village', wards: ['District Administrative Complex', 'University Campus Road'] }
          ]
        },
        {
          name: 'Byadgi',
          cities: [
            { name: 'Byadgi Chilli Hub Municipality', wards: ['Ward 1 - International Chilli APMC Yard', 'Ward 4 - Station Road', 'Ward 9 - Kaginele Road'] },
            { name: 'Kaginele Heritage Village', wards: ['Kanakadasa Smaraka Road', 'Keshava Temple Ward'] }
          ]
        },
        {
          name: 'Ranebennur',
          cities: [
            { name: 'Ranebennur City Municipality', wards: ['Ward 2 - PB Road', 'Ward 7 - Blackbuck Sanctuary Base', 'Ward 15 - Cotton Market', 'Ward 24 - Station Road'] }
          ]
        },
        {
          name: 'Hangal',
          cities: [
            { name: 'Hangal Town Municipality', wards: ['Ward 1 - Tarakeshwara Temple Street', 'Ward 5 - Sirsi Road'] }
          ]
        },
        {
          name: 'Savanur',
          cities: [
            { name: 'Savanur Town', wards: ['Ward 1 - Nawab Palace Road', 'Ward 4 - Baobab Trees Heritage Spot'] }
          ]
        },
        {
          name: 'Shiggaon',
          cities: [
            { name: 'Shiggaon Town Municipality', wards: ['Ward 1 - Hubballi-Bengaluru Highway', 'Ward 5 - Court Road'] },
            { name: 'Gotagodi Village', wards: ['Utsav Rock Garden Area', 'Grama Panchayat Ward 1'] }
          ]
        },
        {
          name: 'Hirekerur',
          cities: [
            { name: 'Hirekerur Town', wards: ['Ward 1 - Durga Devi Road', 'Ward 4 - Lake View Road'] }
          ]
        }
      ]
    },
    {
      name: 'Kodagu (Madikeri)',
      taluks: [
        {
          name: 'Madikeri Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Madikeri City Municipal Council',
                  wards: ['Ward 1 - Raja Seat Road', 'Ward 5 - Madikeri Fort & Palace', 'Ward 10 - College Road', 'Ward 16 - Stuart Hill', 'Ward 22 - Mahadevpet']
                }
              ]
            }
          ],
          cities: [
            { name: 'Madikeri City Municipal Council', wards: ['Ward 1 - Raja Seat Road', 'Ward 5 - Madikeri Fort & Palace', 'Ward 10 - College Road'] },
            { name: 'Bhagamandala Village', wards: ['Triveni Sangama Ghat', 'Bhagandeshwara Temple Road'] },
            { name: 'Talakaveri Sacred Village', wards: ['Kaveri Birthplace Complex', 'Brahmagiri Hill Road'] }
          ]
        },
        {
          name: 'Kushalnagar',
          cities: [
            { name: 'Kushalnagar Town Municipality', wards: ['Ward 2 - Golden Temple Road (Bylakuppe)', 'Ward 6 - BM Road', 'Ward 11 - Kaveri Nisargadhama Base'] },
            { name: 'Bylakuppe Tibetan Settlement', wards: ['Camp 1 Monastery Road', 'Namdroling Golden Temple Area', 'Handicraft Market'] }
          ]
        },
        {
          name: 'Virajpet',
          cities: [
            { name: 'Virajpet Town Municipality', wards: ['Ward 1 - Clock Tower Junction', 'Ward 4 - St. Anne Church Road', 'Ward 9 - Malethirike Hill Base'] }
          ]
        },
        {
          name: 'Somwarpet',
          cities: [
            { name: 'Somwarpet Town', wards: ['Ward 1 - Honnamana Kere Road', 'Ward 4 - Coffee Plantation Area'] },
            { name: 'Shanivarsanthe Village', wards: ['Market Street', 'Grama Panchayat Ward'] }
          ]
        },
        {
          name: 'Ponnampet',
          cities: [
            { name: 'Ponnampet Town', wards: ['Ward 1 - Forestry College Road', 'Ward 3 - Sports Complex Area'] },
            { name: 'Gonikoppal Commercial Hub', wards: ['Main Bazaar Road', 'Kaveri College Road'] }
          ]
        }
      ]
    },
    {
      name: 'Kolar',
      taluks: [
        {
          name: 'Kolar Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Kolar City Municipal Council',
                  wards: ['Ward 2 - Clock Tower Circle', 'Ward 7 - Kolaramma Temple Road', 'Ward 14 - MB Road', 'Ward 23 - Gulpet', 'Ward 31 - Fort Area']
                }
              ]
            }
          ],
          cities: [
            { name: 'Kolar City Municipal Council', wards: ['Ward 2 - Clock Tower Circle', 'Ward 7 - Kolaramma Temple Road', 'Ward 14 - MB Road'] },
            { name: 'Antharagange Foothills Village', wards: ['Cave Temple Ascent Road', 'Eco Tourism Zone'] },
            { name: 'Vokkaleri Village', wards: ['Silk Farm Road', 'Grama Chawadi'] }
          ]
        },
        {
          name: 'Kolar Gold Fields (Robertsonpet)',
          cities: [
            { name: 'Robertsonpet (KGF) City Corporation', wards: ['Ward 1 - Champion Reefs', 'Ward 5 - Marikuppam Gold Mines', 'Ward 12 - Andersonpet', 'Ward 18 - Oorgaum', 'Ward 25 - Coromandel'] },
            { name: 'BEML Nagar Township', wards: ['Factory Gate Road', 'BEML Quarters'] }
          ]
        },
        {
          name: 'Bangarapet',
          cities: [
            { name: 'Bangarapet Town Municipality', wards: ['Ward 1 - Railway Junction Road', 'Ward 6 - Market Road', 'Ward 11 - Desihalli'] }
          ]
        },
        {
          name: 'Malur',
          cities: [
            { name: 'Malur Industrial Town', wards: ['Ward 2 - KIADB Industrial Area', 'Ward 8 - Railway Station Road', 'Ward 15 - Channakal'] }
          ]
        },
        {
          name: 'Mulbagal',
          cities: [
            { name: 'Mulbagal Town Municipality', wards: ['Ward 1 - Anjaneya Temple Street', 'Ward 6 - Sripadaraja Mutt Road', 'Ward 12 - National Highway 75'] },
            { name: 'Avani Heritage Village', wards: ['Ramalingeshwara Temple Complex', 'Grama Ward 1'] },
            { name: 'Kurudumale Sacred Village', wards: ['Maha Ganapathi Temple Area', 'Village Square'] }
          ]
        },
        {
          name: 'Srinivaspur',
          cities: [
            { name: 'Srinivaspur Mango City', wards: ['Ward 1 - Largest Mango APMC Market', 'Ward 5 - Court Road', 'Ward 10 - Chintamani Road'] }
          ]
        }
      ]
    },
    {
      name: 'Koppal',
      taluks: [
        {
          name: 'Koppal Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Koppal City Municipal Council',
                  wards: ['Ward 3 - Koppal Fort Area', 'Ward 8 - Gavisiddheshwara Mutt Road', 'Ward 15 - Station Road', 'Ward 24 - Kinnal Road', 'Ward 30 - Bhagyanagar']
                }
              ]
            }
          ],
          cities: [
            { name: 'Koppal City Municipal Council', wards: ['Ward 3 - Koppal Fort Area', 'Ward 8 - Gavisiddheshwara Mutt Road', 'Ward 15 - Station Road'] },
            { name: 'Kinnal Heritage Village', wards: ['Kinnal Wooden Toy Artisans Street', 'Gramatana Ward'] },
            { name: 'Bhagyanagar Saree Suburb', wards: ['Weaver Colony', 'Main Road'] }
          ]
        },
        {
          name: 'Gangavathi',
          cities: [
            { name: 'Gangavathi Rice City Municipality', wards: ['Ward 2 - CBS Circle', 'Ward 7 - Rice Mill Industrial Area', 'Ward 14 - Julai Nagar', 'Ward 22 - Kampli Road'] },
            { name: 'Anegundi Heritage Village (Kishkindha)', wards: ['Anjanadri Hill (Hanuman Birthplace) Road', 'Pampa Sarovara Area', 'Ranganatha Temple Street'] }
          ]
        },
        {
          name: 'Kushtagi',
          cities: [
            { name: 'Kushtagi Town Municipality', wards: ['Ward 1 - National Highway 50', 'Ward 5 - Market Yard', 'Ward 11 - Ilkal Cross'] }
          ]
        },
        {
          name: 'Yelburga',
          cities: [
            { name: 'Yelburga Town', wards: ['Ward 1 - Bus Stand Road', 'Ward 4 - Court Area'] },
            { name: 'Kuknoor Temple Town', wards: ['Navalinga Temple Complex', 'Mahadeva Temple Road'] }
          ]
        },
        {
          name: 'Kanakagiri',
          cities: [
            { name: 'Kanakagiri Heritage Town', wards: ['Ward 1 - Kanakachala Lakshmi Narasimha Temple', 'Ward 4 - Royal Bathing Ghats'] }
          ]
        },
        {
          name: 'Karatagi',
          cities: [
            { name: 'Karatagi Town', wards: ['Ward 1 - Paddy Market Yard', 'Ward 5 - Sindhanur Road'] }
          ]
        }
      ]
    },
    {
      name: 'Raichur',
      taluks: [
        {
          name: 'Raichur Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Raichur City Municipal Corporation',
                  wards: ['Ward 3 - Raichur Fort Complex', 'Ward 9 - Station Road', 'Ward 18 - Gandhi Chowk', 'Ward 27 - Basaveshwara Circle', 'Ward 36 - Askihal']
                }
              ]
            }
          ],
          cities: [
            { name: 'Raichur City Municipal Corporation', wards: ['Ward 3 - Raichur Fort Complex', 'Ward 9 - Station Road', 'Ward 18 - Gandhi Chowk'] },
            { name: 'Shaktinagar Thermal Power Township', wards: ['RTPS Plant Gate', 'Colony Sector 1', 'Colony Sector 2'] },
            { name: 'Yermarus Industrial Suburb', wards: ['YTPS Thermal Plant Road', 'KIADB Industrial Layout'] }
          ]
        },
        {
          name: 'Sindhanur',
          cities: [
            { name: 'Sindhanur Paddy Capital City', wards: ['Ward 1 - Kushnoor Road', 'Ward 6 - Sukalpet', 'Ward 14 - Ganga Nagar', 'Ward 22 - APMC Market Yard'] },
            { name: 'R.H. Colonies (Camp 1 to 5)', wards: ['Camp 1 Main Road', 'Camp 3 Market Area'] }
          ]
        },
        {
          name: 'Manvi',
          cities: [
            { name: 'Manvi Town Municipality', wards: ['Ward 2 - Jagannatha Dasa Samadhi Road', 'Ward 7 - Hill Fort View', 'Ward 13 - Raichur Road'] }
          ]
        },
        {
          name: 'Lingsugur',
          cities: [
            { name: 'Lingsugur Town Municipality', wards: ['Ward 1 - Bus Stand Road', 'Ward 5 - Court Circle', 'Ward 10 - Mudgal Road'] },
            { name: 'Mudgal Heritage Town', wards: ['Historic Mudgal Fort Area', 'Main Bazaar Street'] }
          ]
        },
        {
          name: 'Devadurga',
          cities: [
            { name: 'Devadurga Town', wards: ['Ward 1 - Fort Road', 'Ward 4 - Market Street'] }
          ]
        },
        {
          name: 'Maski',
          cities: [
            { name: 'Maski Historic Town', wards: ['Ward 1 - Ashokan Rock Edict Site', 'Ward 4 - Bus Stand Circle'] }
          ]
        },
        {
          name: 'Sirwar',
          cities: [
            { name: 'Sirwar Town', wards: ['Ward 1 - Main Bazaar', 'Ward 4 - Cotton Market'] }
          ]
        }
      ]
    },
    {
      name: 'Ramanagara',
      taluks: [
        {
          name: 'Ramanagara Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Ramanagara Silk City Municipality',
                  wards: ['Ward 2 - Asia Largest Silk Cocoon Market', 'Ward 7 - Ijoor', 'Ward 14 - BM Road', 'Ward 21 - Ramadevara Betta Foothills', 'Ward 28 - Vinayaka Nagar']
                }
              ]
            }
          ],
          cities: [
            { name: 'Ramanagara Silk City Municipality', wards: ['Ward 2 - Silk Cocoon Market', 'Ward 7 - Ijoor', 'Ward 14 - BM Road'] },
            { name: 'Ramadevara Betta Vulture Sanctuary Village', wards: ['Sholay Shooting Hill Base', 'Temple Steps Ward'] },
            { name: 'Bidadi Industrial Satellite Hub', wards: ['Toyota Industrial Township', 'Bidadi Smart City Hub', 'Hejjala Cross'] }
          ]
        },
        {
          name: 'Channapatna',
          cities: [
            { name: 'Channapatna Toy City Municipality', wards: ['Ward 1 - Wooden Toy Craft Center', 'Ward 6 - BM Road', 'Ward 12 - Mangalwarpet', 'Ward 19 - Syedwadi'] }
          ]
        },
        {
          name: 'Kanakapura',
          cities: [
            { name: 'Kanakapura City Municipality', wards: ['Ward 2 - Arkavathi River Bank', 'Ward 7 - BM Road', 'Ward 15 - MG Road'] },
            { name: 'Sangama & Mekedatu Village', wards: ['Kaveri-Arkavathi Confluence Point', 'Goat Leap Gorge Base'] }
          ]
        },
        {
          name: 'Magadi',
          cities: [
            { name: 'Magadi Town Municipality', wards: ['Ward 1 - Kempegowda Fort Base', 'Ward 4 - Ranganatha Swamy Temple Road', 'Ward 9 - Huliyurdurga Road'] }
          ]
        },
        {
          name: 'Harohalli',
          cities: [
            { name: 'Harohalli Industrial Hub', wards: ['KIADB Industrial Phases 1 & 2', 'Town Market', 'Grama Panchayat Ward 1'] }
          ]
        }
      ]
    },
    {
      name: 'Uttara Kannada (Karwar)',
      taluks: [
        {
          name: 'Karwar Urban',
          hoblis: [
            {
              name: 'Karwar Kasaba',
              cities: [
                {
                  name: 'Karwar City Municipal Council',
                  wards: ['Ward 2 - Tagore Beach Promenade', 'Ward 7 - INS Kadamba Naval Base Outer', 'Ward 13 - Baithkol Fisheries Harbour', 'Ward 20 - Habbuwada', 'Ward 27 - Kodibag Kali River']
                }
              ]
            }
          ],
          cities: [
            { name: 'Karwar City Municipal Council', wards: ['Ward 2 - Tagore Beach Promenade', 'Ward 7 - Naval Base Outer', 'Ward 13 - Baithkol Harbour'] },
            { name: 'Sadashivgad Historic Village', wards: ['Kali River Bridge View', 'Sadashivgad Fort Hill'] }
          ]
        },
        {
          name: 'Kumta',
          cities: [
            { name: 'Kumta Coastal Municipality', wards: ['Ward 1 - Heritage Car Street', 'Ward 5 - Mirjan Fort Base', 'Ward 10 - Betkuli Beach Road'] },
            { name: 'Gokarna Holy Pilgrimage Town', wards: ['Mahabaleshwara Temple Car Street', 'Om Beach Base Road', 'Kudle Beach Road', 'Koti Teertha'] }
          ]
        },
        {
          name: 'Bhatkal',
          cities: [
            { name: 'Bhatkal Coastal Municipality', wards: ['Ward 2 - Old Port Road', 'Ward 8 - Shamsuddin Circle', 'Ward 15 - Bunder Road'] },
            { name: 'Murudeshwar Temple & Beach Town', wards: ['Shiva Statue Temple Complex', 'Beach Promenade Road', 'Temple Car Street'] }
          ]
        },
        {
          name: 'Sirsi',
          cities: [
            { name: 'Sirsi Arecanut Capital City', wards: ['Ward 1 - Marikamba Temple Road', 'Ward 6 - Largest Arecanut TSS Market', 'Ward 14 - Kasturba Nagar', 'Ward 22 - Sahyadri Colony'] },
            { name: 'Yana Rocks Eco Village', wards: ['Bhairaveshwara Shikhara Base', 'Forest Trekking Path'] },
            { name: 'Sahasralinga Sacred Village', wards: ['Shalmala River Bed', 'Bridge Road'] }
          ]
        },
        {
          name: 'Dandeli',
          cities: [
            { name: 'Dandeli Eco City Municipality', wards: ['Ward 1 - Kali River Rafting Base', 'Ward 5 - Paper Mill Colony', 'Ward 10 - Kulgi Nature Camp Area'] }
          ]
        },
        {
          name: 'Honnavar',
          cities: [
            { name: 'Honnavar Coastal Town', wards: ['Ward 1 - Sharavathi Railway Bridge Area', 'Ward 4 - Eco Beach Kasarkod', 'Ward 8 - Port Road'] }
          ]
        },
        {
          name: 'Ankola',
          cities: [
            { name: 'Ankola Town', wards: ['Ward 1 - Arya Durga Temple Street', 'Ward 4 - Honey & Cashew Market'] }
          ]
        },
        {
          name: 'Siddapur',
          cities: [
            { name: 'Siddapur Town', wards: ['Ward 1 - Burude Falls Base Road', 'Ward 4 - Market Street'] }
          ]
        },
        {
          name: 'Yellapur',
          cities: [
            { name: 'Yellapur Town', wards: ['Ward 1 - Magod Falls Base Road', 'Ward 4 - Sathodi Falls Road'] }
          ]
        },
        {
          name: 'Haliyal',
          cities: [
            { name: 'Haliyal Town', wards: ['Ward 1 - Sugar Factory Road', 'Ward 4 - Fort Area'] }
          ]
        },
        {
          name: 'Joida',
          cities: [
            { name: 'Joida Sahyadri Town', wards: ['Ward 1 - Supa Dam Township Area', 'Ward 3 - Forest Range Office'] }
          ]
        }
      ]
    },
    {
      name: 'Vijayanagara (Hospete)',
      taluks: [
        {
          name: 'Hosapete Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Hosapete City Municipal Corporation',
                  wards: ['Ward 3 - Station Road', 'Ward 8 - Sardar Vallabhbhai Patel Circle', 'Ward 16 - TB Dam Road', 'Ward 25 - College Road', 'Ward 34 - Amaravathi']
                }
              ]
            },
            {
              name: 'Kamalapura Heritage Hobli',
              cities: [
                {
                  name: 'Hampi UNESCO World Heritage Village',
                  wards: ['Hampi Bazaar Street', 'Virupaksha Temple Car Street', 'Vitthala Stone Chariot Complex Area', 'Royal Enclosure Road']
                },
                {
                  name: 'Kamalapura Heritage Town',
                  wards: ['Archaeological Museum Road', 'Pattabhirama Temple Street', 'Queen Bath Environs']
                }
              ]
            }
          ],
          cities: [
            { name: 'Hosapete City Municipal Corporation', wards: ['Ward 3 - Station Road', 'Ward 8 - Patel Circle', 'Ward 16 - TB Dam Road'] },
            { name: 'Hampi UNESCO Heritage Village', wards: ['Hampi Bazaar Street', 'Virupaksha Temple Car Street', 'Vitthala Stone Chariot Complex'] },
            { name: 'Tungabhadra Dam Township', wards: ['Dam Crest Gate Area', 'Vaikunta Guest House Hill', 'Japanese Gardens Base'] }
          ]
        },
        {
          name: 'Kotturu',
          cities: [
            { name: 'Kotturu Guru Town Municipality', wards: ['Ward 1 - Guru Kottureshwara Temple Car Street', 'Ward 5 - APMC Market', 'Ward 9 - Station Road'] }
          ]
        },
        {
          name: 'Hagaribommanahalli',
          cities: [
            { name: 'Hagaribommanahalli Town', wards: ['Ward 1 - Malvi Dam Road', 'Ward 5 - Agricultural Market'] }
          ]
        },
        {
          name: 'Harapanahalli',
          cities: [
            { name: 'Harapanahalli Town Municipality', wards: ['Ward 1 - Fort Area', 'Ward 6 - Main Bazaar', 'Ward 11 - Taluk Office Road'] }
          ]
        },
        {
          name: 'Kudligi',
          cities: [
            { name: 'Kudligi Town', wards: ['Ward 1 - Gandhi Smaraka Circle', 'Ward 4 - Sandur Cross'] }
          ]
        },
        {
          name: 'Hoovina Hadagali',
          cities: [
            { name: 'Hadagali Town', wards: ['Ward 1 - Jasmine Flower APMC Yard', 'Ward 4 - Tungabhadra River Bank'] }
          ]
        }
      ]
    },
    {
      name: 'Vijayapura (Bijapur)',
      taluks: [
        {
          name: 'Vijayapura Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Vijayapura City Corporation',
                  wards: ['Ward 1 - Gol Gumbaz Whispering Gallery Road', 'Ward 8 - Ibrahim Roza Heritage Precinct', 'Ward 15 - MG Road', 'Ward 24 - Station Road', 'Ward 33 - Gandhi Chowk', 'Ward 42 - Ashram Road']
                }
              ]
            }
          ],
          cities: [
            { name: 'Vijayapura City Corporation', wards: ['Ward 1 - Gol Gumbaz Road', 'Ward 8 - Ibrahim Roza Precinct', 'Ward 15 - MG Road', 'Ward 24 - Station Road'] },
            { name: 'Toravi Sacred Village', wards: ['Narasimha Temple Road', 'Navarasapura Music Hall Area'] },
            { name: 'Almatti Dam Township', wards: ['Lal Bahadur Shastri Dam Complex', 'Rock Garden Perimeter', 'Mughal Gardens Area'] }
          ]
        },
        {
          name: 'Basavana Bagewadi',
          cities: [
            { name: 'Basavana Bagewadi Holy Town', wards: ['Ward 1 - Basaveshwara Birthplace Temple', 'Ward 5 - Kudala Sangama Road', 'Ward 10 - Market Street'] }
          ]
        },
        {
          name: 'Indi',
          cities: [
            { name: 'Indi Town Municipality', wards: ['Ward 2 - Lemon Market Yard', 'Ward 7 - Station Road', 'Ward 13 - Solapur Highway'] }
          ]
        },
        {
          name: 'Muddebihal',
          cities: [
            { name: 'Muddebihal Town Municipality', wards: ['Ward 1 - Kudalasangama Road', 'Ward 5 - APMC Market', 'Ward 10 - Taluk Office Road'] }
          ]
        },
        {
          name: 'Sindagi',
          cities: [
            { name: 'Sindagi Town Municipality', wards: ['Ward 1 - Sharanawadi', 'Ward 6 - Kalaburagi Highway', 'Ward 11 - Market Road'] }
          ]
        },
        {
          name: 'Kolhar',
          cities: [
            { name: 'Kolhar Village (Famous Curd Capital)', wards: ['National Highway Curd Market', 'Krishna River Bank'] }
          ]
        },
        {
          name: 'Chadchan',
          cities: [
            { name: 'Chadchan Town', wards: ['Ward 1 - Textile Market', 'Ward 4 - Border Checkpost Road'] }
          ]
        }
      ]
    },
    {
      name: 'Yadgir',
      taluks: [
        {
          name: 'Yadgir Urban',
          hoblis: [
            {
              name: 'Kasaba Hobli',
              cities: [
                {
                  name: 'Yadgir City Municipal Council',
                  wards: ['Ward 2 - Yadgir Hill Fort Base', 'Ward 7 - Station Road', 'Ward 13 - Subhash Chowk', 'Ward 20 - Chittapur Road', 'Ward 28 - Gandhi Nagar']
                }
              ]
            }
          ],
          cities: [
            { name: 'Yadgir City Municipal Council', wards: ['Ward 2 - Yadgir Hill Fort Base', 'Ward 7 - Station Road', 'Ward 13 - Subhash Chowk'] },
            { name: 'Hattikuni Village', wards: ['Hattikuni Dam Area', 'Forest Checkpost Road'] }
          ]
        },
        {
          name: 'Shahapur',
          cities: [
            { name: 'Shahapur Fort City Municipality', wards: ['Ward 1 - Sleeping Buddha Hill Base', 'Ward 6 - Basaveshwara Circle', 'Ward 12 - Sagar Road'] }
          ]
        },
        {
          name: 'Surpur (Shorapur)',
          cities: [
            { name: 'Surpur Heritage Town Municipality', wards: ['Ward 2 - Raja Venkatappa Nayaka Fort Palace', 'Ward 7 - Taylor Manzil Heritage Spot', 'Ward 14 - Market Road'] }
          ]
        },
        {
          name: 'Gurmitkal',
          cities: [
            { name: 'Gurmitkal Silk Town', wards: ['Ward 1 - Khadi Weavers Street', 'Ward 4 - Dhab Dhabi Waterfalls Road'] }
          ]
        },
        {
          name: 'Hunsagi',
          cities: [
            { name: 'Hunsagi Town', wards: ['Ward 1 - Prehistoric Paleolithic Site Area', 'Ward 4 - Narayanpur Dam Road'] },
            { name: 'Narayanpur Dam Village', wards: ['Basavasagara Dam Crest', 'Irrigation Colony'] }
          ]
        },
        {
          name: 'Wadagera',
          cities: [
            { name: 'Wadagera Town', wards: ['Ward 1 - Main Chawadi', 'Ward 3 - Krishna River Basin Road'] }
          ]
        }
      ]
    }
  ]
};

// GET location search by keyword (street, village, town, district, landmark) with Google Geocoding & local catalog
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      res.status(400).json({ error: 'Search query parameter q is required' });
      return;
    }

    const trimmed = q.trim();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    let googleResults: any[] = [];
    if (apiKey) {
      try {
        const queryWithState = trimmed.toLowerCase().includes('karnataka')
          ? trimmed
          : `${trimmed}, Karnataka, India`;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(queryWithState)}&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === 'OK' && data.results) {
          googleResults = data.results.map((r: any) => {
            let street = '';
            let area = '';
            let taluk = '';
            let district = '';
            for (const comp of r.address_components) {
              if (comp.types.includes('route') || comp.types.includes('street_number')) {
                street = street ? `${comp.long_name}, ${street}` : comp.long_name;
              }
              if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) {
                area = area || comp.long_name;
              }
              if (comp.types.includes('locality')) {
                taluk = taluk || comp.long_name;
              }
              if (comp.types.includes('administrative_area_level_2')) {
                district = comp.long_name;
              }
            }
            return {
              formatted_address: r.formatted_address,
              lat: r.geometry.location.lat,
              lng: r.geometry.location.lng,
              street: street || r.formatted_address.split(',')[0],
              area,
              taluk,
              district,
              source: 'google'
            };
          });
        }
      } catch (err) {
        console.warn('Google search query failed, using internal catalog:', err);
      }
    }

    // Also match against local 31-district catalog
    const localMatches: any[] = [];
    const lowerQ = trimmed.toLowerCase();
    const db = getDatabase();
    const dataset = (db as any).karnatakaLocations || COMPREHENSIVE_KARNATAKA_LOCATIONS;

    for (const d of dataset.districts) {
      const distMatch = d.name.toLowerCase().includes(lowerQ);
      for (const t of d.taluks) {
        const talukMatch = t.name.toLowerCase().includes(lowerQ);
        for (const c of t.cities || []) {
          const cityMatch = c.name.toLowerCase().includes(lowerQ);
          if (distMatch || talukMatch || cityMatch) {
            localMatches.push({
              formatted_address: `${c.name}, ${t.name} Taluk, ${d.name} District, Karnataka`,
              district: d.name,
              taluk: t.name,
              city: c.name,
              lat: 12.9716,
              lng: 77.5946,
              source: 'catalog'
            });
          }
        }
      }
    }

    const combined = [...googleResults, ...localMatches].slice(0, 10);
    res.json({
      success: true,
      query: trimmed,
      results: combined
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Search failed' });
  }
});

export const KARNATAKA_DISTRICT_COORDINATES: Record<
  string,
  { lat: number; lng: number; headquarters: string; zoom: number }
> = {
  Bagalkote: { lat: 16.1817, lng: 75.6958, headquarters: 'Bagalkote', zoom: 11 },
  Ballari: { lat: 15.1394, lng: 76.9214, headquarters: 'Ballari', zoom: 11 },
  Belagavi: { lat: 15.8497, lng: 74.4977, headquarters: 'Belagavi', zoom: 11 },
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, headquarters: 'Bengaluru', zoom: 12 },
  'Bengaluru Rural': { lat: 13.245, lng: 77.7126, headquarters: 'Devanahalli', zoom: 11 },
  Bidar: { lat: 17.9104, lng: 77.5199, headquarters: 'Bidar', zoom: 11 },
  Chamarajanagar: { lat: 11.9261, lng: 76.9437, headquarters: 'Chamarajanagar', zoom: 11 },
  Chikkaballapura: { lat: 13.4355, lng: 77.7315, headquarters: 'Chikkaballapura', zoom: 11 },
  Chikkamagaluru: { lat: 13.3161, lng: 75.772, headquarters: 'Chikkamagaluru', zoom: 11 },
  Chitradurga: { lat: 14.2251, lng: 76.398, headquarters: 'Chitradurga', zoom: 11 },
  'Dakshina Kannada (Mangaluru)': { lat: 12.9141, lng: 74.856, headquarters: 'Mangaluru', zoom: 11 },
  Davanagere: { lat: 14.4644, lng: 75.9218, headquarters: 'Davanagere', zoom: 11 },
  'Dharwad (Hubballi-Dharwad)': { lat: 15.3647, lng: 75.124, headquarters: 'Dharwad', zoom: 11 },
  Gadag: { lat: 15.4298, lng: 75.6318, headquarters: 'Gadag-Betageri', zoom: 11 },
  Hassan: { lat: 13.0072, lng: 76.0964, headquarters: 'Hassan', zoom: 11 },
  Haveri: { lat: 14.7967, lng: 75.4011, headquarters: 'Haveri', zoom: 11 },
  Kalaburagi: { lat: 17.3297, lng: 76.8343, headquarters: 'Kalaburagi', zoom: 11 },
  'Kodagu (Madikeri)': { lat: 12.4244, lng: 75.7382, headquarters: 'Madikeri', zoom: 11 },
  Kolar: { lat: 13.1367, lng: 78.1291, headquarters: 'Kolar', zoom: 11 },
  Koppal: { lat: 15.3547, lng: 76.1554, headquarters: 'Koppal', zoom: 11 },
  Mandya: { lat: 12.5238, lng: 76.897, headquarters: 'Mandya', zoom: 11 },
  Mysuru: { lat: 12.2958, lng: 76.6394, headquarters: 'Mysuru', zoom: 11 },
  Raichur: { lat: 16.2076, lng: 77.3463, headquarters: 'Raichur', zoom: 11 },
  Ramanagara: { lat: 12.7209, lng: 77.2799, headquarters: 'Ramanagara', zoom: 11 },
  Shivamogga: { lat: 13.9299, lng: 75.5681, headquarters: 'Shivamogga', zoom: 11 },
  Tumakuru: { lat: 13.3409, lng: 77.101, headquarters: 'Tumakuru', zoom: 11 },
  Udupi: { lat: 13.3409, lng: 74.7421, headquarters: 'Udupi', zoom: 11 },
  'Uttara Kannada (Karwar)': { lat: 14.8185, lng: 74.1352, headquarters: 'Karwar', zoom: 11 },
  Vijayapura: { lat: 16.8302, lng: 75.71, headquarters: 'Vijayapura', zoom: 11 },
  'Vijayanagara (Hosapete)': { lat: 15.2689, lng: 76.3909, headquarters: 'Hosapete', zoom: 11 },
  Yadgir: { lat: 16.7644, lng: 77.1378, headquarters: 'Yadgir', zoom: 11 }
};

export function normalizeDistrictKey(dist: string | undefined): string {
  if (!dist) return '';
  const d = dist.toLowerCase().trim();
  if (d.includes('urban')) return 'bengaluru urban';
  if (d.includes('rural')) return 'bengaluru rural';
  if (d.includes('mangaluru') || d.includes('dakshina kannada')) return 'dakshina kannada (mangaluru)';
  if (d.includes('dharwad') || d.includes('hubballi')) return 'dharwad (hubballi-dharwad)';
  if (d.includes('kodagu') || d.includes('madikeri')) return 'kodagu (madikeri)';
  if (d.includes('uttara kannada') || d.includes('karwar')) return 'uttara kannada (karwar)';
  if (d.includes('vijayanagara') || d.includes('hosapete')) return 'vijayanagara (hosapete)';
  if (d.includes('chikkamagaluru') || d.includes('chikmagalur')) return 'chikkamagaluru';
  if (d.includes('chikkaballapura') || d.includes('chickballapur')) return 'chikkaballapura';
  if (d.includes('shivamogga') || d.includes('shimoga')) return 'shivamogga';
  if (d.includes('belagavi') || d.includes('belgaum')) return 'belagavi';
  if (d.includes('kalaburagi') || d.includes('gulbarga')) return 'kalaburagi';
  if (d.includes('ballari') || d.includes('bellary')) return 'ballari';
  if (d.includes('vijayapura') || d.includes('bijapur')) return 'vijayapura';
  if (d.includes('mysuru') || d.includes('mysore')) return 'mysuru';
  return d.replace(/[\(\)-]/g, '').trim();
}

// GET dynamic collection map data for all 31 Karnataka districts
router.get('/collection-map-data', (req: Request, res: Response): void => {
  try {
    const db = getDatabase();
    const dataset = (db as any).karnatakaLocations || { state: 'Karnataka', districts: ALL_31_KARNATAKA_DISTRICTS };
    const rawDistricts: DistrictData[] = dataset.districts || ALL_31_KARNATAKA_DISTRICTS;

    const allComplaints = db.complaints || [];
    const allPickups = db.pickupRequests || [];
    const allStaff = (db.users || []).filter(u => u.role === 'STAFF');
    const allBins = db.wasteBins || [];

    const districtsList = rawDistricts.map(d => {
      const coords = KARNATAKA_DISTRICT_COORDINATES[d.name] || {
        lat: 13.5,
        lng: 76.5,
        headquarters: d.name,
        zoom: 11
      };

      const distKey = normalizeDistrictKey(d.name);

      const assignedStaff = allStaff.filter(s => normalizeDistrictKey(s.district) === distKey);
      const districtComplaints = allComplaints.filter(c => normalizeDistrictKey(c.district) === distKey);
      const districtPickups = allPickups.filter(p => {
        const pDist = (p as any).district || (p.address && p.address.toLowerCase().includes(d.name.toLowerCase()) ? d.name : '');
        return normalizeDistrictKey(pDist) === distKey;
      });
      const districtBins = allBins.filter(b => normalizeDistrictKey(b.district) === distKey);

      // Pending pickups: Requested, Pending, Assigned, Submitted
      const pendingPickups = districtPickups.filter(p =>
        ['requested', 'pending', 'assigned', 'submitted', 'scheduled'].includes((p.status || '').toLowerCase())
      );

      // Ongoing collections: In Progress, Work In Progress, Staff En Route, Arrived, Accepted
      const ongoingComplaints = districtComplaints.filter(c =>
        ['in progress', 'work in progress', 'staff en route', 'arrived', 'accepted', 'verified'].includes(
          (c.status || '').toLowerCase()
        )
      );
      const ongoingPickups = districtPickups.filter(p =>
        ['in progress', 'en route', 'picked up', 'arrived'].includes((p.status || '').toLowerCase())
      );
      const ongoingCollections = [
        ...ongoingComplaints.map(c => ({ ...c, collectionType: 'complaint' })),
        ...ongoingPickups.map(p => ({ ...p, collectionType: 'pickup' }))
      ];

      // Completed collections: Resolved, Closed, Work Completed, Waste Collected
      const completedComplaints = districtComplaints.filter(c =>
        ['resolved', 'closed', 'work completed', 'waste collected', 'approved'].includes(
          (c.status || '').toLowerCase()
        )
      );
      const completedPickups = districtPickups.filter(p =>
        ['completed', 'closed', 'resolved'].includes((p.status || '').toLowerCase())
      );
      const completedCollections = [
        ...completedComplaints.map(c => ({ ...c, collectionType: 'complaint' })),
        ...completedPickups.map(p => ({ ...p, collectionType: 'pickup' }))
      ];

      // Active complaints: all non-closed/resolved complaints
      const activeComplaints = districtComplaints.filter(
        c => !['resolved', 'closed', 'rejected'].includes((c.status || '').toLowerCase())
      );

      const hasData = Boolean(
        assignedStaff.length > 0 ||
        pendingPickups.length > 0 ||
        ongoingCollections.length > 0 ||
        completedCollections.length > 0 ||
        activeComplaints.length > 0 ||
        districtBins.length > 0
      );

      return {
        name: d.name,
        headquarters: coords.headquarters,
        lat: coords.lat,
        lng: coords.lng,
        zoom: coords.zoom,
        taluksCount: d.taluks?.length || 0,
        hasData,
        stats: {
          assignedStaffCount: assignedStaff.length,
          pendingPickupsCount: pendingPickups.length,
          ongoingCollectionsCount: ongoingCollections.length,
          completedCollectionsCount: completedCollections.length,
          activeComplaintsCount: activeComplaints.length,
          binsCount: districtBins.length
        },
        assignedStaff: assignedStaff.map(s => {
          const activeTasksCount = allComplaints.filter(
            c => c.assignedStaffId === s.id && !['resolved', 'closed'].includes((c.status || '').toLowerCase())
          ).length;
          const completedTasksCount = allComplaints.filter(
            c => c.assignedStaffId === s.id && ['resolved', 'closed', 'work completed'].includes((c.status || '').toLowerCase())
          ).length;
          return {
            id: s.id,
            name: s.name,
            email: s.email,
            mobile: s.mobile,
            ward: s.ward,
            district: s.district,
            staffBadge: s.staffBadgeNumber || s.employeeId || (s as any).staffBadge || 'STAFF',
            activeTasks: activeTasksCount,
            completedTasks: completedTasksCount
          };
        }),
        pendingPickups: pendingPickups.map(p => ({
          id: p.id,
          citizenName: p.citizenName,
          address: p.address,
          ward: (p as any).ward || '',
          district: (p as any).district || d.name,
          wasteType: p.wasteType,
          estimatedWeightKg: (p as any).estimatedWeightKg || p.estimatedQtyKg || 0,
          scheduledDate: (p as any).scheduledDate || p.preferredDate || '',
          timeSlot: (p as any).timeSlot || p.preferredTimeSlot || '',
          status: p.status,
          lat: p.lat,
          lng: p.lng
        })),
        ongoingCollections,
        completedCollections,
        activeComplaints,
        wasteBins: districtBins
      };
    });

    res.json({
      success: true,
      totalDistricts: districtsList.length,
      districts: districtsList
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load collection map data' });
  }
});

// GET all Karnataka administrative locations hierarchy
router.get('/', (req, res): void => {
  const db = getDatabase();
  const dataset = (db as any).karnatakaLocations || { state: 'Karnataka', districts: ALL_31_KARNATAKA_DISTRICTS };
  res.json({
    state: dataset.state || 'Karnataka',
    districts: dataset.districts || ALL_31_KARNATAKA_DISTRICTS
  });
});

// GET specific district taluks and wards
router.get('/district/:name', (req, res): void => {
  const { name } = req.params;
  const db = getDatabase();
  const dataset = (db as any).karnatakaLocations || { state: 'Karnataka', districts: ALL_31_KARNATAKA_DISTRICTS };
  const districts = dataset.districts || ALL_31_KARNATAKA_DISTRICTS;
  const district = districts.find(
    (d: any) => d.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );

  if (!district) {
    res.status(404).json({ error: `District '${name}' not found in Karnataka registry.` });
    return;
  }

  res.json({ district });
});

// GET reverse geocode endpoint calling Google Maps Geocoding API securely
router.get('/reverse-geocode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      res.status(400).json({ error: 'lat and lng parameters are required' });
      return;
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (apiKey) {
      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const topResult = data.results[0];
          let street = '';
          let area = '';
          let taluk = '';
          let district = '';
          let state = 'Karnataka';
          let postalCode = '';

          for (const comp of topResult.address_components) {
            if (comp.types.includes('route') || comp.types.includes('street_number')) {
              street = street ? `${comp.long_name}, ${street}` : comp.long_name;
            }
            if (comp.types.includes('sublocality') || comp.types.includes('sublocality_level_1') || comp.types.includes('neighborhood')) {
              area = area || comp.long_name;
            }
            if (comp.types.includes('locality')) {
              taluk = taluk || comp.long_name;
            }
            if (comp.types.includes('administrative_area_level_2')) {
              district = comp.long_name;
            }
            if (comp.types.includes('administrative_area_level_1')) {
              state = comp.long_name;
            }
            if (comp.types.includes('postal_code')) {
              postalCode = comp.long_name;
            }
          }

          res.json({
            success: true,
            formatted_address: topResult.formatted_address,
            street: street || topResult.formatted_address.split(',')[0],
            area,
            taluk,
            district,
            state,
            postalCode,
            lat: topResult.geometry.location.lat,
            lng: topResult.geometry.location.lng
          });
          return;
        }
      } catch (gErr) {
        console.warn('Google reverse geocode failed, falling back:', gErr);
      }
    }

    // High-reliability Fallback reverse-geocoding
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'SmartWaste-Karnataka-Gov/2.0 (Civic Grievance Reporting)' }
      });
      const nomData = await nomRes.json();
      if (nomData && nomData.address) {
        const addr = nomData.address;
        const street = addr.road || addr.pedestrian || addr.suburb || '';
        const area = addr.neighbourhood || addr.suburb || addr.residential || '';
        const taluk = addr.county || addr.town || addr.village || addr.city || '';
        const district = addr.state_district || addr.district || '';
        const state = addr.state || 'Karnataka';
        const postalCode = addr.postcode || '';

        res.json({
          success: true,
          formatted_address: nomData.display_name || `${lat}, ${lng}`,
          street,
          area,
          taluk,
          district,
          state,
          postalCode,
          lat: parseFloat(lat as string),
          lng: parseFloat(lng as string)
        });
        return;
      }
    } catch (nomErr) {
      console.warn('Fallback geocoding error:', nomErr);
    }

    res.json({
      success: false,
      error_message: 'Could not resolve address coordinates.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Reverse geocoding failed' });
  }
});

// Admin management: Add new district / location
router.post('/', authenticate, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { district } = req.body;
    if (!district || !district.name) {
      res.status(400).json({ error: 'Valid district payload required' });
      return;
    }
    const db = getDatabase();
    if (!(db as any).karnatakaLocations) {
      (db as any).karnatakaLocations = JSON.parse(JSON.stringify(COMPREHENSIVE_KARNATAKA_LOCATIONS));
    }
    const existingIdx = (db as any).karnatakaLocations.districts.findIndex(
      (d: any) => d.name.toLowerCase() === district.name.toLowerCase()
    );
    if (existingIdx !== -1) {
      (db as any).karnatakaLocations.districts[existingIdx] = district;
    } else {
      (db as any).karnatakaLocations.districts.push(district);
    }
    saveDatabase(db);
    res.json({ message: 'Location hierarchy updated successfully', districts: (db as any).karnatakaLocations.districts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update location hierarchy' });
  }
});

export default router;
