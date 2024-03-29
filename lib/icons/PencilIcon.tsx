import { Color } from '@lib/defines/constants';
import { IconCommonProps } from '@lib/defines/types';

export interface PencilIconProps extends IconCommonProps {}

export function PencilIcon(props: PencilIconProps) {
  const { width = 16, height = 16, color = Color.GRAY_8 } = props;

  return (
    <svg xmlns={'http://www.w3.org/2000/svg'} width={width} height={height} fill={color} className={'bi bi-pencil'} viewBox={'0 0 16 16'}>
      <path
        d={
          'M12.146.146a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-10 10a.5.5 0 01-.168.11l-5 2a.5.5 0 01-.65-.65l2-5a.5.5 0 01.11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 01.5.5v.5h.5a.5.5 0 01.5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 015 12.5V12h-.5a.5.5 0 01-.5-.5V11h-.5a.5.5 0 01-.468-.325z'
        }
      />
    </svg>
  );
}
