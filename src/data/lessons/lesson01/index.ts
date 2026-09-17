import type { Lesson } from '../../../types/scene';
import { displaySubtitle } from '../../course';
import { lesson01Scenes } from './scenes';

export const lesson01: Lesson = {
  id: 'lesson01',
  number: 1,
  title: 'Python概述',
  subtitle: displaySubtitle({ number: 1, title: 'Python概述' }),
  hours: 3,
  sceneCount: lesson01Scenes.length,
  scenes: lesson01Scenes,
};
