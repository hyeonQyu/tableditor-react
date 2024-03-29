import { Color } from '@lib/defines/constants';
import { IconCommonProps } from '@lib/defines/types';

export interface VerticalIconProps extends IconCommonProps {}

export function VerticalIcon(props: VerticalIconProps) {
  const { width = 16, height = 16, color = Color.GRAY_8 } = props;

  return (
    <svg xmlns={'http://www.w3.org/2000/svg'} width={width} height={height} fill={color} className={'bi bi-vr'} viewBox={'0 0 16 16'}>
      <path
        d={
          'M3 12V4a1 1 0 011-1h2.5V2H4a2 2 0 00-2 2v8a2 2 0 002 2h2.5v-1H4a1 1 0 01-1-1zm6.5 1v1H12a2 2 0 002-2V4a2 2 0 00-2-2H9.5v1H12a1 1 0 011 1v8a1 1 0 01-1 1H9.5zM8 16a.5.5 0 01-.5-.5V.5a.5.5 0 011 0v15a.5.5 0 01-.5.5z'
        }
      />
    </svg>
  );
}
