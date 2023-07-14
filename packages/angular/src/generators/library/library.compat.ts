import { convertNxGenerator } from '@nx/devkit';
import library from './library';

export const librarySchematic = convertNxGenerator(library);
