export interface Bike {
  fromName: string;
  status: string;
  date: string;
  id: number;
  locked: boolean;
}

const bikes: Bike[] = [
  {
    fromName: 'Charlie\'s Bike',
    status: 'Locked',
    date: '9:32 AM',
    id: 0,
    locked: true
  },
  {
    fromName: 'Benji\'s Bike',
    status: 'Unlocked',
    date: '6:12 AM',
    id: 1,
    locked: false
  },
  // {
  //   fromName: 'Jordan Firth',
  //   subject: 'Report Results',
  //   date: '4:55 AM',
  //   id: 2

  // },
  // {
  //   fromName: 'Bill Thomas',
  //   subject: 'The situation',
  //   date: 'Yesterday',
  //   id: 3
  // },
  // {
  //   fromName: 'Joanne Pollan',
  //   subject: 'Updated invitation: Swim lessons',
  //   date: 'Yesterday',
  //   id: 4
  // },
  // {
  //   fromName: 'Andrea Cornerston',
  //   subject: 'Last minute ask',
  //   date: 'Yesterday',
  //   id: 5
  // },
  // {
  //   fromName: 'Moe Chamont',
  //   subject: 'Family Calendar - Version 1',
  //   date: 'Last Week',
  //   id: 6
  // },
  // {
  //   fromName: 'Kelly Richardson',
  //   subject: 'Placeholder Headhots',
  //   date: 'Last Week',
  //   id: 7
  // }
];

export const getBikes = () => bikes;

export const getBike = (id: number) => bikes.find(m => m.id === id);