const data = JSON.stringify([
        {
            lat: 45.523241975045636,
            lon: 141.93649435423438,
            title: 'Wakkanai',
            description: 'Northermost point in mainland Japan',
            plannedArrivalDate: 'July 1 2022',
            tags: ["StartStop"]
        },
        {
            lat: 44.1790083875689,
            lon: 142.39378454618748,
            title: 'Shibetsu',
            description: 'City in northern Hokkaido',
            plannedArrivalDate: 'July 2 2022',
            tags: ["Maintenance", "Lodging"]
        },
        {
            lat: 43.067673538580195,
            lon: 141.37354240974204,
            title: 'Sapporo',
            description: 'Biggest city in Hokkaido',
            plannedArrivalDate: 'July 4 2022',
            tags: ["Sightseeing", "Lodging"]
        },
        {
            lat: 41.39620994963105,
            lon: 140.27141479105563,
            title: 'Seikan Tunnel',
            description: 'Connecting tunnel between Hokkaido and Honshu',
            plannedArrivalDate: 'July 5 2022',
            tags: ["Sightseeing"]
        },
        {
            lat: 40.82308475864612,
            lon: 140.74589757110496,
            title: 'Aomori',
            description: 'City in northern Honshu. Be sure to check out the fish market!',
            plannedArrivalDate: 'July 6 2022',
            tags: ["Sightseeing"]
        },
        {
            lat: 40.22432678206862,
            lon: 140.37353192810406,
            title: 'Kitaakita',
            description: 'City in northern Honshu',
            plannedArrivalDate: 'July 7 2022',
            tags: ["Lodging"]
        },
        {
            lat: 39.713185436021014,
            lon: 140.10088604346808,
            title: 'Akita',
            description: 'City on the Sea of Japan',
            plannedArrivalDate: 'July 9 2022',
            tags: ["Maintenance"]
        },
        {
            lat: 38.901545022051806,
            lon: 139.84358581520794,
            title: 'Sakata',
            description: 'City on the Sea of Japan',
            plannedArrivalDate: 'July 11 2022',
            tags: ["Lodging", "Maintenance"]
        },
        {
            lat: 37.91043193946174,
            lon: 139.03462905024435,
            title: 'Niigata',
            description: 'City on the Sea of Japan',
            plannedArrivalDate: 'July 12 2022',
            tags: ["Sightseeing"]
        },
        {
            lat: 37.06314618353918,
            lon: 138.87388054047895,
            title: 'Muikamachi',
            description: 'City in central Honshu',
            plannedArrivalDate: 'July 13 2022',
            tags: ["Lodging"]
        },
        {
            lat: 36.62266784905093,
            lon: 138.59864669804534,
            title: 'Kusatsu Onsen',
            description: 'Onsen Town',
            plannedArrivalDate: 'July 15 2022',
            tags: ["Onsen", "Lodging"]
        },
        {
            lat: 36.26092809055346,
            lon: 136.89964030789258,
            title: 'Shirakawa-go',
            description: 'Historical village known for its thatched-roof houses',
            plannedArrivalDate: 'July 17 2022',
            tags: ["Sightseeing"]
        },
        {
            lat: 35.603914057109435,
            lon: 135.93684748976162,
            title: 'Mihama',
            description: 'Small town on the Sea of Japan',
            plannedArrivalDate: 'July 18 2022',
            tags: ["Maintenance", "Lodging"]
        },
        {
            lat: 35.003227177506936,
            lon: 135.76377309806512,
            title: 'Kyoto',
            description: 'Old capital of Japan. Try to avoid cycling through the busier streets.',
            plannedArrivalDate: 'July 19 2022',
            tags: ["Maintenance", "Lodging", "Sightseeing", "Onsen"]
        },
        {
            lat: 34.687971821890955,
            lon: 135.18439646798166,
            title: 'Kobe',
            description: 'Medium sized city (compared to Kyoto). Should have some good fish markets.',
            plannedArrivalDate: 'July 20 2022',
            tags: ["Maintenance", "Lodging", "Sightseeing"]
        },
        {
            lat: 34.813478953313876,
            lon: 134.64666945791652,
            title: 'Himeji',
            description: 'City known for its Himeiji Castle.',
            plannedArrivalDate: 'July 21 2022',
            tags: ["Lodging", "Sightseeing"]
        },
        {
            lat: 34.64884962551311,
            lon: 133.93197001040454,
            title: 'Okayama',
            description: 'City in souther Honshu',
            plannedArrivalDate: 'July 22 2022',
            tags: ["Lodging"]
        },
        {
            lat: 34.40782050052603,
            lon: 133.20226186769258,
            title: 'Onomichi',
            description: 'The start of the Shimanami-kaido',
            plannedArrivalDate: 'July 23 2022',
            tags: ["Lodging"]
        },
        {
            lat: 34.24572034448107,
            lon: 133.07756925952322,
            title: 'Shimanami Kaido',
            description: 'Ocean highway popular among cyclists',
            plannedArrivalDate: 'July 24 2022',
            tags: ["Sightseeing", "Maintenance"]
        },
        {
            lat: 34.063427445931225,
            lon: 133.00177791113416,
            title: 'Imabari',
            description: 'City at the end of the Shimanami Kaido',
            plannedArrivalDate: 'July 25 2022',
            tags: ["Lodging"]
        },
        {
            lat: 33.46039391882322,
            lon: 132.4318939205688,
            title: 'Yawatahama',
            description: 'City on the western tip of Shikoku',
            plannedArrivalDate: 'July 26 2022',
            tags: ["Lodging", "Onsen"]
        },
        {
            lat: 33.23592065312114,
            lon: 131.62184410104075,
            title: 'Oita',
            description: 'City on the eastern tip of Kyushu',
            plannedArrivalDate: 'July 27 2022',
            tags: ["Lodging"]
        },
        {
            lat: 32.80186294478596,
            lon: 130.74485054379173,
            title: 'Kumamoto',
            description: 'The home of Kumamon',
            plannedArrivalDate: 'July 27 2022',
            tags: ["Maintenance", "Lodging", "Sightseeing"]
        },
        {
            lat: 32.26218679297172,
            lon: 130.9384056384268,
            title: 'Taragi',
            description: 'City in central Kyushu',
            plannedArrivalDate: 'July 28 2022',
            tags: ["Lodging"]
        },
        {
            lat: 30.997005309529722,
            lon: 130.65926019195493,
            title: 'Cape Sata',
            description: 'Southernmost point in mainland Japan',
            plannedArrivalDate: 'July 29 2022',
            tags: ["StartStop"]
        }
    ]);

export default data;