import { style } from 'typestyle';
import * as csstips from 'csstips';
import { primary, buttonText, primaryDarkest, alert } from './colors';
import { sizing } from './sizes';
import { border } from 'csx';

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

export const alertBorder = border({
    color: alert.toString(),
    width: sizing.borderWidth,
    style: 'solid',
});

export const input = {
    height: sizing.normalBig,
    fontSize: sizing.small,
    borderRadius: sizing.smallest,
};

export const horizontalCenterBaseline = style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

export const errorContainer = style({
    fontSize: sizing.small,
    color: alert.toString(),
});
