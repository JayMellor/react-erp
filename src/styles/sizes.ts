import { px } from 'csx';

export const sizing: Readonly<{ [key: string]: string | number }> = {
    none: px(0),
    borderWidth: px(1),
    smallest: px(4),
    smaller: px(8),
    small: px(12),
    normal: px(16),
    normalBig: px(24),
    normalBigger: px(32),
    normalBiggest: px(48),
    big: px(64),
    bigger: px(96),
    biggest: px(128),
};
