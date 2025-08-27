import { useContext } from 'react';
import { MyContext } from './index';
export function Child() {
  const { value } = useContext(MyContext) as any;
  return <div>{value}</div>;
}
