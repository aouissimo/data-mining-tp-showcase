import type { DataRow } from './preprocessing';

export const weatherData: DataRow[] = [
  { Outlook: 'Sunny', Temperature: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'No' },
  { Outlook: 'Sunny', Temperature: 'Hot', Humidity: 'High', Wind: 'Strong', Play: 'No' },
  { Outlook: 'Overcast', Temperature: 'Hot', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'High', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'No' },
  { Outlook: 'Overcast', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' },
  { Outlook: 'Sunny', Temperature: 'Mild', Humidity: 'High', Wind: 'Weak', Play: 'No' },
  { Outlook: 'Sunny', Temperature: 'Cool', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Sunny', Temperature: 'Mild', Humidity: 'Normal', Wind: 'Strong', Play: 'Yes' },
  { Outlook: 'Overcast', Temperature: 'Mild', Humidity: 'High', Wind: 'Strong', Play: 'Yes' },
  { Outlook: 'Overcast', Temperature: 'Hot', Humidity: 'Normal', Wind: 'Weak', Play: 'Yes' },
  { Outlook: 'Rain', Temperature: 'Mild', Humidity: 'High', Wind: 'Strong', Play: 'No' },
];

export const titanicSample: DataRow[] = [
  { Survived: 0, Pclass: 3, Sex: 'male', Age: 22, SibSp: 1, Parch: 0, Fare: 7.25 },
  { Survived: 1, Pclass: 1, Sex: 'female', Age: 38, SibSp: 1, Parch: 0, Fare: 71.28 },
  { Survived: 1, Pclass: 3, Sex: 'female', Age: 26, SibSp: 0, Parch: 0, Fare: 7.92 },
  { Survived: 1, Pclass: 1, Sex: 'female', Age: 35, SibSp: 1, Parch: 0, Fare: 53.1 },
  { Survived: 0, Pclass: 3, Sex: 'male', Age: 35, SibSp: 0, Parch: 0, Fare: 8.05 },
  { Survived: 0, Pclass: 3, Sex: 'male', Age: null, SibSp: 0, Parch: 0, Fare: 8.45 }, // Missing value
  { Survived: 0, Pclass: 1, Sex: 'male', Age: 54, SibSp: 0, Parch: 0, Fare: 51.86 },
  { Survived: 0, Pclass: 3, Sex: 'male', Age: 2, SibSp: 3, Parch: 1, Fare: 21.07 },
  { Survived: 1, Pclass: 3, Sex: 'female', Age: 27, SibSp: 0, Parch: 2, Fare: 11.13 },
  { Survived: 1, Pclass: 2, Sex: 'female', Age: 14, SibSp: 1, Parch: 0, Fare: 30.07 },
  { Survived: 1, Pclass: 3, Sex: 'female', Age: 4, SibSp: 1, Parch: 1, Fare: 16.7 },
  { Survived: 1, Pclass: 1, Sex: 'female', Age: 58, SibSp: 0, Parch: 0, Fare: 26.55 },
  { Survived: 0, Pclass: 3, Sex: 'male', Age: 20, SibSp: 0, Parch: 0, Fare: 8.05 },
];
