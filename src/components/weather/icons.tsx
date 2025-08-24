import type { LucideProps } from 'lucide-react';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudSun, Wind, Droplets, Thermometer, MapPin, Lightbulb, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const Icons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  thunderstorm: CloudLightning,
  snow: Snowflake,
  partlyCloudy: CloudSun,
  wind: Wind,
  humidity: Droplets,
  temperature: Thermometer,
  location: MapPin,
  advice: Lightbulb,
  safe: CheckCircle2,
  caution: AlertTriangle,
  dangerous: XCircle,
};

interface WeatherIconProps extends LucideProps {
  description: string;
}

export const WeatherIcon = ({ description, ...props }: WeatherIconProps) => {
  const normalizedDescription = description.toLowerCase().replace(/\s/g, '');

  switch (normalizedDescription) {
    case 'sunny':
      return <Icons.sun {...props} />;
    case 'cloudy':
      return <Icons.cloud {...props} />;
    case 'partlycloudy':
      return <Icons.partlyCloudy {...props} />;
    case 'rain':
    case 'rainy':
      return <Icons.rain {...props} />;
    case 'thunderstorm':
      return <Icons.thunderstorm {...props} />;
    case 'snow':
    case 'snowy':
      return <Icons.snow {...props} />;
    default:
      return <Icons.sun {...props} />;
  }
};
