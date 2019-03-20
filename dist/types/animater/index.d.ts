import Translater from '../translater';
import { Options as BScrollOptions } from '../Options';
import Animater from './Base';
import Transition from './Transition';
import Animation from './Animation';
export { Animater, Transition, Animation };
export default function createAnimater(element: HTMLElement, translater: Translater, options: BScrollOptions): Transition | Animation;
