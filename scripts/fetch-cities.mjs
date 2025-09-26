#!/usr/bin/env node

/**
 * Fetch Cities Script
 * Fetches cities/towns within ~100 miles of Royse City, TX using Overpass API
 * Generates src/data/cities.json for static site generation
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Royse City coordinates
const ROYSE_CITY_LAT = 32.9751;
const ROYSE_CITY_LON = -96.3325;
const RADIUS_METERS = 160934; // ~100 miles

// Overpass API endpoint
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';

// Must-include cities (I-30/DFW corridor)
const MUST_INCLUDE = [
  { name: 'Dallas', state: 'TX', lat: 32.7767, lon: -96.7970 },
  { name: 'Fort Worth', state: 'TX', lat: 32.7555, lon: -97.3308 },
  { name: 'Arlington', state: 'TX', lat: 32.7357, lon: -97.1081 },
  { name: 'Plano', state: 'TX', lat: 33.0198, lon: -96.6989 },
  { name: 'Frisco', state: 'TX', lat: 33.1507, lon: -96.8236 },
  { name: 'McKinney', state: 'TX', lat: 33.1972, lon: -96.6153 },
  { name: 'Garland', state: 'TX', lat: 32.9126, lon: -96.6389 },
  { name: 'Richardson', state: 'TX', lat: 32.9483, lon: -96.7297 },
  { name: 'Carrollton', state: 'TX', lat: 32.9756, lon: -96.8892 },
  { name: 'Lewisville', state: 'TX', lat: 33.0462, lon: -96.9942 },
  { name: 'Flower Mound', state: 'TX', lat: 33.0146, lon: -97.0969 },
  { name: 'The Colony', state: 'TX', lat: 33.0890, lon: -96.8864 },
  { name: 'Little Elm', state: 'TX', lat: 33.1626, lon: -96.9375 },
  { name: 'Prosper', state: 'TX', lat: 33.2362, lon: -96.8011 },
  { name: 'Celina', state: 'TX', lat: 33.3412, lon: -96.7836 },
  { name: 'Aubrey', state: 'TX', lat: 33.3043, lon: -96.9861 },
  { name: 'Pilot Point', state: 'TX', lat: 33.3965, lon: -96.9603 },
  { name: 'Denton', state: 'TX', lat: 33.2148, lon: -97.1331 },
  { name: 'Krum', state: 'TX', lat: 33.2612, lon: -97.2381 },
  { name: 'Ponder', state: 'TX', lat: 33.1818, lon: -97.2886 },
  { name: 'Argyle', state: 'TX', lat: 33.1212, lon: -97.1836 },
  { name: 'Bartonville', state: 'TX', lat: 33.0740, lon: -97.1481 },
  { name: 'Copper Canyon', state: 'TX', lat: 33.0957, lon: -97.0967 },
  { name: 'Double Oak', state: 'TX', lat: 33.0654, lon: -97.1103 },
  { name: 'Highland Village', state: 'TX', lat: 33.0918, lon: -97.0467 },
  { name: 'Lake Dallas', state: 'TX', lat: 33.1290, lon: -97.0286 },
  { name: 'Oak Point', state: 'TX', lat: 33.1834, lon: -96.9972 },
  { name: 'Shady Shores', state: 'TX', lat: 33.1648, lon: -97.0322 },
  { name: 'Westlake', state: 'TX', lat: 32.9912, lon: -97.2039 },
  { name: 'Southlake', state: 'TX', lat: 32.9412, lon: -97.1342 },
  { name: 'Colleyville', state: 'TX', lat: 32.8807, lon: -97.1553 },
  { name: 'Grapevine', state: 'TX', lat: 32.9343, lon: -97.0781 },
  { name: 'Bedford', state: 'TX', lat: 32.8440, lon: -97.1431 },
  { name: 'Euless', state: 'TX', lat: 32.8371, lon: -97.0819 },
  { name: 'Hurst', state: 'TX', lat: 32.8235, lon: -97.1706 },
  { name: 'North Richland Hills', state: 'TX', lat: 32.8343, lon: -97.2289 },
  { name: 'Watauga', state: 'TX', lat: 32.8579, lon: -97.2547 },
  { name: 'Keller', state: 'TX', lat: 32.9346, lon: -97.2517 },
  { name: 'Haslet', state: 'TX', lat: 32.9748, lon: -97.3470 },
  { name: 'Blue Mound', state: 'TX', lat: 32.8574, lon: -97.3386 },
  { name: 'Saginaw', state: 'TX', lat: 32.8601, lon: -97.3636 },
  { name: 'River Oaks', state: 'TX', lat: 32.7771, lon: -97.3945 },
  { name: 'Lake Worth', state: 'TX', lat: 32.8121, lon: -97.4459 },
  { name: 'White Settlement', state: 'TX', lat: 32.7593, lon: -97.4581 },
  { name: 'Everman', state: 'TX', lat: 32.6307, lon: -97.2892 },
  { name: 'Edgecliff Village', state: 'TX', lat: 32.6576, lon: -97.3431 },
  { name: 'Kennedale', state: 'TX', lat: 32.6468, lon: -97.2259 },
  { name: 'Pantego', state: 'TX', lat: 32.7143, lon: -97.1564 },
  { name: 'Dalworthington Gardens', state: 'TX', lat: 32.6882, lon: -97.1553 },
  { name: 'Mansfield', state: 'TX', lat: 32.5632, lon: -97.1417 },
  { name: 'Crow Museum', state: 'TX', lat: 32.6832, lon: -97.3614 },
  { name: 'Burleson', state: 'TX', lat: 32.5421, lon: -97.3209 },
  { name: 'Joshua', state: 'TX', lat: 32.4618, lon: -97.3881 },
  { name: 'Cleburne', state: 'TX', lat: 32.3473, lon: -97.3867 },
  { name: 'Keene', state: 'TX', lat: 32.3968, lon: -97.3236 },
  { name: 'Alvarado', state: 'TX', lat: 32.4065, lon: -97.2114 },
  { name: 'Venus', state: 'TX', lat: 32.4299, lon: -97.0967 },
  { name: 'Briaroaks', state: 'TX', lat: 32.5118, lon: -97.3042 },
  { name: 'Cross Timber', state: 'TX', lat: 32.4876, lon: -97.3325 },
  { name: 'Godley', state: 'TX', lat: 32.4457, lon: -97.5267 },
  { name: 'Annetta', state: 'TX', lat: 32.6987, lon: -97.6542 },
  { name: 'Annetta North', state: 'TX', lat: 32.7207, lon: -97.6542 },
  { name: 'Annetta South', state: 'TX', lat: 32.6768, lon: -97.6542 },
  { name: 'Aledo', state: 'TX', lat: 32.6943, lon: -97.6022 },
  { name: 'Benbrook', state: 'TX', lat: 32.6732, lon: -97.4606 },
  { name: 'Westworth Village', state: 'TX', lat: 32.7718, lon: -97.4259 },
  { name: 'Westover Hills', state: 'TX', lat: 32.7443, lon: -97.4131 },
  { name: 'Trophy Club', state: 'TX', lat: 33.0001, lon: -97.1836 },
  { name: 'Roanoke', state: 'TX', lat: 33.0040, lon: -97.2259 },
  { name: 'Justin', state: 'TX', lat: 33.0848, lon: -97.2967 },
  { name: 'Northlake', state: 'TX', lat: 33.1107, lon: -97.2667 },
  { name: 'New Fairview', state: 'TX', lat: 33.1112, lon: -97.4836 },
  { name: 'Rhome', state: 'TX', lat: 33.0543, lon: -97.4772 },
  { name: 'Aurora', state: 'TX', lat: 33.0587, lon: -97.5036 },
  { name: 'Corinth', state: 'TX', lat: 33.1540, lon: -97.0642 },
  { name: 'Hickory Creek', state: 'TX', lat: 33.1137, lon: -97.0436 },
  { name: 'Sanger', state: 'TX', lat: 33.3637, lon: -97.1736 },
  { name: 'Valley View', state: 'TX', lat: 33.4923, lon: -97.1636 },
  { name: 'Collinsville', state: 'TX', lat: 33.5598, lon: -96.9114 },
  { name: 'Tioga', state: 'TX', lat: 33.4673, lon: -96.9172 },
  { name: 'Gunter', state: 'TX', lat: 33.4512, lon: -96.7486 },
  { name: 'Van Alstyne', state: 'TX', lat: 33.4212, lon: -96.5772 },
  { name: 'Anna', state: 'TX', lat: 33.3498, lon: -96.5486 },
  { name: 'Westminster', state: 'TX', lat: 33.3557, lon: -96.4586 },
  { name: 'Melissa', state: 'TX', lat: 33.2857, lon: -96.5722 },
  { name: 'Fairview', state: 'TX', lat: 33.1507, lon: -96.6136 },
  { name: 'Lowry Crossing', state: 'TX', lat: 33.2462, lon: -96.5486 },
  { name: 'Hackberry', state: 'TX', lat: 33.1498, lon: -96.9186 },
  { name: 'Lincoln Park', state: 'TX', lat: 33.2287, lon: -96.9486 },
  { name: 'St. Paul', state: 'TX', lat: 33.0412, lon: -96.5486 },
  { name: 'Blue Ridge', state: 'TX', lat: 33.2973, lon: -96.4014 },
  { name: 'Farmersville', state: 'TX', lat: 33.1637, lon: -96.3586 },
  { name: 'Nevada', state: 'TX', lat: 33.0423, lon: -96.3786 },
  { name: 'Josephine', state: 'TX', lat: 33.0612, lon: -96.3186 },
  { name: 'West Tawakoni', state: 'TX', lat: 32.8968, lon: -96.0286 },
  { name: 'East Tawakoni', state: 'TX', lat: 32.8968, lon: -96.0286 },
  { name: 'Hawk Cove', state: 'TX', lat: 32.8818, lon: -96.0786 },
  { name: 'Point', state: 'TX', lat: 32.9312, lon: -95.8686 },
  { name: 'Quinlan', state: 'TX', lat: 32.9104, lon: -96.1353 },
  { name: 'Westminster', state: 'TX', lat: 32.7768, lon: -96.4586 },
  { name: 'Seagoville', state: 'TX', lat: 32.6465, lon: -96.5386 },
  { name: 'Crandall', state: 'TX', lat: 32.6279, lon: -96.4586 },
  { name: 'Combine', state: 'TX', lat: 32.5887, lon: -96.5086 },
  { name: 'Talty', state: 'TX', lat: 32.6887, lon: -96.3886 },
  { name: 'Kaufman', state: 'TX', lat: 32.5893, lon: -96.3086 },
  { name: 'Forney', state: 'TX', lat: 32.7482, lon: -96.4719 },
  { name: 'Terrell', state: 'TX', lat: 32.7357, lon: -96.2753 },
  { name: 'Wills Point', state: 'TX', lat: 32.7093, lon: -96.0086 },
  { name: 'Edgewood', state: 'TX', lat: 32.6937, lon: -95.8886 },
  { name: 'Alba', state: 'TX', lat: 32.7923, lon: -95.6386 },
  { name: 'Mineola', state: 'TX', lat: 32.6632, lon: -95.4886 },
  { name: 'Quitman', state: 'TX', lat: 32.7957, lon: -95.4486 },
  { name: 'Hawkins', state: 'TX', lat: 32.5887, lon: -95.2086 },
  { name: 'Big Sandy', state: 'TX', lat: 32.5837, lon: -95.1186 },
  { name: 'Gladewater', state: 'TX', lat: 32.5365, lon: -94.9486 },
  { name: 'White Oak', state: 'TX', lat: 32.5287, lon: -94.8586 },
  { name: 'Hallsville', state: 'TX', lat: 32.5037, lon: -94.5786 },
  { name: 'Marshall', state: 'TX', lat: 32.5468, lon: -94.3672 },
  { name: 'Jefferson', state: 'TX', lat: 32.7574, lon: -94.3453 },
  { name: 'Linden', state: 'TX', lat: 33.0123, lon: -94.3653 },
  { name: 'Avinger', state: 'TX', lat: 32.9037, lon: -94.5586 },
  { name: 'Hughes Springs', state: 'TX', lat: 32.9987, lon: -94.6286 },
  { name: 'Daingerfield', state: 'TX', lat: 33.0318, lon: -94.7219 },
  { name: 'Mount Pleasant', state: 'TX', lat: 33.1568, lon: -94.9681 },
  { name: 'Pittsburg', state: 'TX', lat: 32.9957, lon: -94.9681 },
  { name: 'Winfield', state: 'TX', lat: 33.1687, lon: -95.1186 },
  { name: 'Sulphur Springs', state: 'TX', lat: 33.1384, lon: -95.6011 },
  { name: 'Cumby', state: 'TX', lat: 33.1387, lon: -95.8386 },
  { name: 'Campbell', state: 'TX', lat: 33.1487, lon: -95.9486 },
  { name: 'Commerce', state: 'TX', lat: 33.2473, lon: -95.8997 },
  { name: 'Cooper', state: 'TX', lat: 33.3737, lon: -95.6886 },
  { name: 'Ladonia', state: 'TX', lat: 33.4287, lon: -95.9486 },
  { name: 'Paris', state: 'TX', lat: 33.6609, lon: -95.5555 },
  { name: 'Reno', state: 'TX', lat: 33.6687, lon: -95.4686 },
  { name: 'Powderly', state: 'TX', lat: 33.8187, lon: -95.5286 },
  { name: 'Detroit', state: 'TX', lat: 33.6687, lon: -95.2686 },
  { name: 'Bogata', state: 'TX', lat: 33.4687, lon: -95.2186 },
  { name: 'Talmage', state: 'TX', lat: 33.5687, lon: -95.1186 },
  { name: 'Clarksville', state: 'TX', lat: 33.6109, lon: -95.0528 },
  { name: 'Deport', state: 'TX', lat: 33.5287, lon: -95.3186 },
  { name: 'Annona', state: 'TX', lat: 33.5787, lon: -94.9186 },
  { name: 'Avery', state: 'TX', lat: 33.5487, lon: -94.7786 },
  { name: 'Hooks', state: 'TX', lat: 33.4687, lon: -94.2886 },
  { name: 'New Boston', state: 'TX', lat: 33.4637, lon: -94.4186 },
  { name: 'Maud', state: 'TX', lat: 33.3337, lon: -94.3486 },
  { name: 'Redwater', state: 'TX', lat: 33.3587, lon: -94.2586 },
  { name: 'Texarkana', state: 'TX', lat: 33.4251, lon: -94.0477 },
  { name: 'Nash', state: 'TX', lat: 33.4418, lon: -94.1314 },
  { name: 'Wake Village', state: 'TX', lat: 33.4268, lon: -94.1069 },
  { name: 'Liberty City', state: 'TX', lat: 33.4187, lon: -94.1186 },
  { name: 'Leary', state: 'TX', lat: 33.4687, lon: -94.2186 },
  { name: 'Simms', state: 'TX', lat: 33.3687, lon: -94.5186 },
  { name: 'Marietta', state: 'TX', lat: 33.1687, lon: -94.5386 },
  { name: 'Douglassville', state: 'TX', lat: 33.1887, lon: -94.3586 },
  { name: 'Atlanta', state: 'TX', lat: 33.1137, lon: -94.1686 },
  { name: 'Bivins', state: 'TX', lat: 32.9687, lon: -94.0786 },
  { name: 'Lone Star', state: 'TX', lat: 32.9487, lon: -94.7086 },
  { name: 'Gary City', state: 'TX', lat: 32.0287, lon: -94.4086 },
  { name: 'Gary', state: 'TX', lat: 32.0287, lon: -94.4086 },
  { name: 'Harleton', state: 'TX', lat: 32.6787, lon: -94.5686 },
  { name: 'Karnack', state: 'TX', lat: 32.6787, lon: -94.1686 },
  { name: 'Stonewall', state: 'TX', lat: 32.9287, lon: -94.2686 },
  { name: 'Waskom', state: 'TX', lat: 32.4787, lon: -94.0586 },
  { name: 'Greenwood', state: 'TX', lat: 32.4287, lon: -94.0786 },
  { name: 'Lakeport', state: 'TX', lat: 32.3787, lon: -94.6786 },
  { name: 'Ore City', state: 'TX', lat: 32.7987, lon: -94.7186 },
  { name: 'Kilgore', state: 'TX', lat: 32.3835, lon: -94.8755 },
  { name: 'Longview', state: 'TX', lat: 32.5007, lon: -94.7405 },
  { name: 'Hallsville', state: 'TX', lat: 32.5037, lon: -94.5786 },
  { name: 'East Mountain', state: 'TX', lat: 32.5887, lon: -94.8786 },
  { name: 'Gilmer', state: 'TX', lat: 32.7287, lon: -94.9486 },
  { name: 'Pittsburg', state: 'TX', lat: 32.9957, lon: -94.9681 },
  { name: 'Avinger', state: 'TX', lat: 32.9037, lon: -94.5586 },
  { name: 'Linden', state: 'TX', lat: 33.0123, lon: -94.3653 },
  { name: 'Jefferson', state: 'TX', lat: 32.7574, lon: -94.3453 },
  { name: 'Marshall', state: 'TX', lat: 32.5468, lon: -94.3672 },
  { name: 'Hallsville', state: 'TX', lat: 32.5037, lon: -94.5786 },
  { name: 'White Oak', state: 'TX', lat: 32.5287, lon: -94.8586 },
  { name: 'Gladewater', state: 'TX', lat: 32.5365, lon: -94.9486 },
  { name: 'Big Sandy', state: 'TX', lat: 32.5837, lon: -95.1186 },
  { name: 'Hawkins', state: 'TX', lat: 32.5887, lon: -95.2086 },
  { name: 'Quitman', state: 'TX', lat: 32.7957, lon: -95.4486 },
  { name: 'Mineola', state: 'TX', lat: 32.6632, lon: -95.4886 },
  { name: 'Alba', state: 'TX', lat: 32.7923, lon: -95.6386 },
  { name: 'Edgewood', state: 'TX', lat: 32.6937, lon: -95.8886 },
  { name: 'Wills Point', state: 'TX', lat: 32.7093, lon: -96.0086 },
  { name: 'Terrell', state: 'TX', lat: 32.7357, lon: -96.2753 },
  { name: 'Forney', state: 'TX', lat: 32.7482, lon: -96.4719 },
  { name: 'Kaufman', state: 'TX', lat: 32.5893, lon: -96.3086 },
  { name: 'Talty', state: 'TX', lat: 32.6887, lon: -96.3886 },
  { name: 'Combine', state: 'TX', lat: 32.5887, lon: -96.5086 },
  { name: 'Crandall', state: 'TX', lat: 32.6279, lon: -96.4586 },
  { name: 'Seagoville', state: 'TX', lat: 32.6465, lon: -96.5386 },
  { name: 'Westminster', state: 'TX', lat: 32.7768, lon: -96.4586 },
  { name: 'Hawk Cove', state: 'TX', lat: 32.8818, lon: -96.0786 },
  { name: 'East Tawakoni', state: 'TX', lat: 32.8968, lon: -96.0286 },
  { name: 'West Tawakoni', state: 'TX', lat: 32.8968, lon: -96.0286 },
  { name: 'Josephine', state: 'TX', lat: 33.0612, lon: -96.3186 },
  { name: 'Nevada', state: 'TX', lat: 33.0423, lon: -96.3786 },
  { name: 'Farmersville', state: 'TX', lat: 33.1637, lon: -96.3586 },
  { name: 'Blue Ridge', state: 'TX', lat: 33.2973, lon: -96.4014 },
  { name: 'St. Paul', state: 'TX', lat: 33.0412, lon: -96.5486 },
  { name: 'Hackberry', state: 'TX', lat: 33.1498, lon: -96.9186 },
  { name: 'Lincoln Park', state: 'TX', lat: 33.2287, lon: -96.9486 },
  { name: 'Lowry Crossing', state: 'TX', lat: 33.2462, lon: -96.5486 },
  { name: 'Fairview', state: 'TX', lat: 33.1507, lon: -96.6136 },
  { name: 'Melissa', state: 'TX', lat: 33.2857, lon: -96.5722 },
  { name: 'Westminster', state: 'TX', lat: 33.3557, lon: -96.4586 },
  { name: 'Anna', state: 'TX', lat: 33.3498, lon: -96.5486 },
  { name: 'Van Alstyne', state: 'TX', lat: 33.4212, lon: -96.5772 },
  { name: 'Gunter', state: 'TX', lat: 33.4512, lon: -96.7486 },
  { name: 'Tioga', state: 'TX', lat: 33.4673, lon: -96.9172 },
  { name: 'Collinsville', state: 'TX', lat: 33.5598, lon: -96.9114 },
  { name: 'Valley View', state: 'TX', lat: 33.4923, lon: -97.1636 },
  { name: 'Sanger', state: 'TX', lat: 33.3637, lon: -97.1736 },
  { name: 'Hickory Creek', state: 'TX', lat: 33.1137, lon: -97.0436 },
  { name: 'Corinth', state: 'TX', lat: 33.1540, lon: -97.0642 },
  { name: 'Aurora', state: 'TX', lat: 33.0587, lon: -97.5036 },
  { name: 'Rhome', state: 'TX', lat: 33.0543, lon: -97.4772 },
  { name: 'New Fairview', state: 'TX', lat: 33.1112, lon: -97.4836 },
  { name: 'Northlake', state: 'TX', lat: 33.1107, lon: -97.2667 },
  { name: 'Justin', state: 'TX', lat: 33.0848, lon: -97.2967 },
  { name: 'Roanoke', state: 'TX', lat: 33.0040, lon: -97.2259 },
  { name: 'Trophy Club', state: 'TX', lat: 33.0001, lon: -97.1836 },
  { name: 'Westover Hills', state: 'TX', lat: 32.7443, lon: -97.4131 },
  { name: 'Westworth Village', state: 'TX', lat: 32.7718, lon: -97.4259 },
  { name: 'Benbrook', state: 'TX', lat: 32.6732, lon: -97.4606 },
  { name: 'Aledo', state: 'TX', lat: 32.6943, lon: -97.6022 },
  { name: 'Annetta South', state: 'TX', lat: 32.6768, lon: -97.6542 },
  { name: 'Annetta North', state: 'TX', lat: 32.7207, lon: -97.6542 },
  { name: 'Annetta', state: 'TX', lat: 32.6987, lon: -97.6542 },
  { name: 'Godley', state: 'TX', lat: 32.4457, lon: -97.5267 },
  { name: 'Cross Timber', state: 'TX', lat: 32.4876, lon: -97.3325 },
  { name: 'Briaroaks', state: 'TX', lat: 32.5118, lon: -97.3042 },
  { name: 'Venus', state: 'TX', lat: 32.4299, lon: -97.0967 },
  { name: 'Alvarado', state: 'TX', lat: 32.4065, lon: -97.2114 },
  { name: 'Keene', state: 'TX', lat: 32.3968, lon: -97.3236 },
  { name: 'Cleburne', state: 'TX', lat: 32.3473, lon: -97.3867 },
  { name: 'Joshua', state: 'TX', lat: 32.4618, lon: -97.3881 },
  { name: 'Burleson', state: 'TX', lat: 32.5421, lon: -97.3209 },
  { name: 'Crow Museum', state: 'TX', lat: 32.6832, lon: -97.3614 },
  { name: 'Mansfield', state: 'TX', lat: 32.5632, lon: -97.1417 },
  { name: 'Dalworthington Gardens', state: 'TX', lat: 32.6882, lon: -97.1553 },
  { name: 'Pantego', state: 'TX', lat: 32.7143, lon: -97.1564 },
  { name: 'Kennedale', state: 'TX', lat: 32.6468, lon: -97.2259 },
  { name: 'Edgecliff Village', state: 'TX', lat: 32.6576, lon: -97.3431 },
  { name: 'Everman', state: 'TX', lat: 32.6307, lon: -97.2892 },
  { name: 'White Settlement', state: 'TX', lat: 32.7593, lon: -97.4581 },
  { name: 'Lake Worth', state: 'TX', lat: 32.8121, lon: -97.4459 },
  { name: 'River Oaks', state: 'TX', lat: 32.7771, lon: -97.3945 },
  { name: 'Saginaw', state: 'TX', lat: 32.8601, lon: -97.3636 },
  { name: 'Blue Mound', state: 'TX', lat: 32.8574, lon: -97.3386 },
  { name: 'Haslet', state: 'TX', lat: 32.9748, lon: -97.3470 },
  { name: 'Keller', state: 'TX', lat: 32.9346, lon: -97.2517 },
  { name: 'Watauga', state: 'TX', lat: 32.8579, lon: -97.2547 },
  { name: 'North Richland Hills', state: 'TX', lat: 32.8343, lon: -97.2289 },
  { name: 'Hurst', state: 'TX', lat: 32.8235, lon: -97.1706 },
  { name: 'Euless', state: 'TX', lat: 32.8371, lon: -97.0819 },
  { name: 'Bedford', state: 'TX', lat: 32.8440, lon: -97.1431 },
  { name: 'Grapevine', state: 'TX', lat: 32.9343, lon: -97.0781 },
  { name: 'Colleyville', state: 'TX', lat: 32.8807, lon: -97.1553 },
  { name: 'Southlake', state: 'TX', lat: 32.9412, lon: -97.1342 },
  { name: 'Westlake', state: 'TX', lat: 32.9912, lon: -97.2039 },
  { name: 'Shady Shores', state: 'TX', lat: 33.1648, lon: -97.0322 },
  { name: 'Oak Point', state: 'TX', lat: 33.1834, lon: -96.9972 },
  { name: 'Lake Dallas', state: 'TX', lat: 33.1290, lon: -97.0286 },
  { name: 'Highland Village', state: 'TX', lat: 33.0918, lon: -97.0467 },
  { name: 'Double Oak', state: 'TX', lat: 33.0654, lon: -97.1103 },
  { name: 'Copper Canyon', state: 'TX', lat: 33.0957, lon: -97.0967 },
  { name: 'Bartonville', state: 'TX', lat: 33.0740, lon: -97.1481 },
  { name: 'Argyle', state: 'TX', lat: 33.1212, lon: -97.1836 },
  { name: 'Ponder', state: 'TX', lat: 33.1818, lon: -97.2886 },
  { name: 'Krum', state: 'TX', lat: 33.2612, lon: -97.2381 },
  { name: 'Denton', state: 'TX', lat: 33.2148, lon: -97.1331 },
  { name: 'Pilot Point', state: 'TX', lat: 33.3965, lon: -96.9603 },
  { name: 'Aubrey', state: 'TX', lat: 33.3043, lon: -96.9861 },
  { name: 'Celina', state: 'TX', lat: 33.3412, lon: -96.7836 },
  { name: 'Prosper', state: 'TX', lat: 33.2362, lon: -96.8011 },
  { name: 'Little Elm', state: 'TX', lat: 33.1626, lon: -96.9375 },
  { name: 'The Colony', state: 'TX', lat: 33.0890, lon: -96.8864 },
  { name: 'Lewisville', state: 'TX', lat: 33.0462, lon: -96.9942 },
  { name: 'Carrollton', state: 'TX', lat: 32.9756, lon: -96.8892 },
  { name: 'Richardson', state: 'TX', lat: 32.9483, lon: -96.7297 },
  { name: 'Garland', state: 'TX', lat: 32.9126, lon: -96.6389 },
  { name: 'McKinney', state: 'TX', lat: 33.1972, lon: -96.6153 },
  { name: 'Frisco', state: 'TX', lat: 33.1507, lon: -96.8236 },
  { name: 'Plano', state: 'TX', lat: 33.0198, lon: -96.6989 },
  { name: 'Arlington', state: 'TX', lat: 32.7357, lon: -97.1081 },
  { name: 'Fort Worth', state: 'TX', lat: 32.7555, lon: -97.3308 },
  { name: 'Dallas', state: 'TX', lat: 32.7767, lon: -96.7970 },
];

/**
 * Slugify a string for URL use
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Calculate haversine distance between two points in miles
 */
function haversineMi(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Fetch cities from Overpass API
 */
async function fetchCitiesFromOverpass() {
  const query = `
    [out:json][timeout:90];
    (
      node["place"="city"](around:${RADIUS_METERS},${ROYSE_CITY_LAT},${ROYSE_CITY_LON});
      node["place"="town"](around:${RADIUS_METERS},${ROYSE_CITY_LAT},${ROYSE_CITY_LON});
      node["place"="village"](around:${RADIUS_METERS},${ROYSE_CITY_LAT},${ROYSE_CITY_LON});
    );
    out meta;
  `;

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ data: query }),
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}\n${await response.text()}`);
    }

    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    console.error('Failed to fetch from Overpass:', error.message);
    throw error;
  }
}

/**
 * Process and deduplicate cities
 */
function processCities(overpassElements) {
  const cities = new Map();

  // Add must-include cities first
  MUST_INCLUDE.forEach(city => {
    const key = `${city.name.toLowerCase()}-${city.state.toLowerCase()}`;
    const distance = haversineMi(ROYSE_CITY_LAT, ROYSE_CITY_LON, city.lat, city.lon);
    cities.set(key, {
      name: city.name,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      distance,
      slug: slugify(city.name),
      place: 'city',
      population: null,
      county: city.county || 'Rockwall', // Default to Rockwall for nearby cities
      source: 'manual'
    });
  });

  // Process Overpass results
  overpassElements.forEach(element => {
    const name = element.tags?.name;
    const state = element.tags?.['addr:state'] || element.tags?.['is_in:state'] || 'TX';
    const population = element.tags?.population ? parseInt(element.tags.population) : null;

    if (!name || state !== 'TX') return;

    // Skip tiny villages
    if (population !== null && population < 500) return;

    const key = `${name.toLowerCase()}-${state.toLowerCase()}`;
    const distance = haversineMi(ROYSE_CITY_LAT, ROYSE_CITY_LON, element.lat, element.lon);

    // Skip if already in must-include or farther than radius
    if (cities.has(key) || distance > 100) return;

    cities.set(key, {
      name,
      state,
      lat: element.lat,
      lon: element.lon,
      distance,
      slug: slugify(name),
      place: element.tags.place || 'city',
      population,
      county: 'Rockwall', // Default county for Overpass cities
      source: 'overpass'
    });
  });

  // Ensure Royse City is present
  const royseKey = 'royse city-tx';
  if (!cities.has(royseKey)) {
    cities.set(royseKey, {
      name: 'Royse City',
      state: 'TX',
      lat: ROYSE_CITY_LAT,
      lon: ROYSE_CITY_LON,
      distance: 0,
      slug: 'royse-city',
      place: 'city',
      population: null,
      county: 'Rockwall',
      source: 'manual'
    });
  }

  return Array.from(cities.values())
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));
}

/**
 * Main execution
 */
async function main() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const outputPath = path.join(dataDir, 'cities.json');
  const skipFetchEnv = (process.env.SKIP_CITY_FETCH || '').toLowerCase();
  const skipFetch = ['1', 'true', 'yes'].includes(skipFetchEnv);

  if (skipFetch) {
    if (fs.existsSync(outputPath)) {
      console.log('Skipping Overpass fetch (SKIP_CITY_FETCH set). Using cached dataset.');
      return;
    }

    console.warn('SKIP_CITY_FETCH requested, but no cached dataset found. Proceeding with network fetch.');
  }

  try {
    console.log('Fetching cities from Overpass API...');
    const overpassElements = await fetchCitiesFromOverpass();

    console.log(`Found ${overpassElements.length} elements from Overpass`);
    console.log(`Must-include cities: ${MUST_INCLUDE.length}`);

    const cities = processCities(overpassElements);

    console.log(`Processed ${cities.length} unique cities`);

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(cities, null, 2));

    console.log(`Cities data written to ${outputPath}`);
    console.log(`First 5 cities:`, cities.slice(0, 5).map(c => `${c.name} (${c.distance.toFixed(1)} miles)`));

  } catch (error) {
    console.error('Error fetching cities:', error.message);

    if (fs.existsSync(outputPath)) {
      try {
        const cached = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        console.warn(`Falling back to cached dataset at ${outputPath}`);
        console.log(`Using cached dataset with ${Array.isArray(cached) ? cached.length : 0} cities.`);
        console.log('Set SKIP_CITY_FETCH=1 to intentionally skip the Overpass request during builds.');
        return;
      } catch (cacheError) {
        console.error('Failed to read cached dataset:', cacheError.message);
      }
    }

    console.error('No cached dataset available. Aborting.');
    process.exit(1);
  }
}

main();