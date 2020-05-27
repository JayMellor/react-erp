import { style, classes } from 'typestyle';
import * as csstips from 'csstips';
import { primary, buttonText, primaryDarkest, alert } from './colors';
import { sizing } from './sizes';
import { border, px } from 'csx';

// BUTTONS

export const button = style(
    {
        background: primary.toString(),
        color: buttonText.toString(),
        border: border({
            color: primaryDarkest.toString(),
            width: sizing.borderWidth,
            style: 'solid',
        }),
        borderRadius: sizing.smallest,
        fontSize: sizing.small,
    },
    csstips.padding(sizing.smallest, sizing.smaller),
);

export const iconButton = classes(
    button,
    style({
        width: sizing.mediumBigger,
    }),
);

// SHADOW

/**
 * Constructs box shadow string from components
 *
 * @param offsetX Offset in X axis in pixels
 * @param offsetY Offset in Y axis in pixels
 * @param blurRadius
 * @param color Colour of shadow
 * 
 * @returns Constructed box shadow string
 */
export const boxShadow = (
    offsetX: number,
    offsetY: number,
    blurRadius: number,
    color: string,
): string => `${px(offsetX)} ${px(offsetY)} ${px(blurRadius)} ${color}`;

// BORDER

export const solidBorder = (color: string): string =>
    border({
        color,
        width: sizing.borderWidth,
        style: 'solid',
    });

export const alertBorder = solidBorder(alert.toString());

// INPUT

export const input = {
    height: sizing.mediumBig,
    fontSize: sizing.small,
    borderRadius: sizing.smallest,
};

// MISC

export const horizontalCenterBaseline = style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

export const errorContainer = style({
    fontSize: sizing.small,
    color: alert.toString(),
});
