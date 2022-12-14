import { MenuSectionProps } from '@components/menu/components/menuSection';
import { MenuColorItemTemplate, MenuItemTemplate } from '@components/tableditor/components/menu/itemTemplate';
import { CellMenuProps } from '@components/tableditor/components/menu/cell';
import { ArrowIcon, EraserIcon, HorizontalIcon, PaintBucketIcon, PencilIcon, VerticalIcon } from '@icons/index';
import { BACKGROUND_COLOR_MAP, FONT_COLOR_MAP, TableditorColorName } from '@components/tableditor/defines';

export interface IUseCellMenuParams extends CellMenuProps {}

export interface IUseCellMenu {
  menuSections: MenuSectionProps[];
}

export function useCellMenu(params: IUseCellMenuParams): IUseCellMenu {
  const {} = params;

  const menuSections: MenuSectionProps[] = [
    {
      label: 'Edit cell',
      items: [
        {
          node: <MenuItemTemplate icon={<PaintBucketIcon />} label={'Background colors'} hasChildMenu />,
          sections: [
            {
              label: 'Background colors',
              items: Object.keys(BACKGROUND_COLOR_MAP).map((colorName) => ({
                node: <MenuColorItemTemplate colorName={colorName as TableditorColorName} type={'background'} />,
                onEvent() {},
              })),
            },
          ],
        },
        {
          node: <MenuItemTemplate icon={<PencilIcon />} label={'Font colors'} hasChildMenu />,
          sections: [
            {
              label: 'Font colors',
              items: Object.keys(FONT_COLOR_MAP).map((colorName) => ({
                node: <MenuColorItemTemplate colorName={colorName as TableditorColorName} type={'font'} />,
                onEvent() {},
              })),
            },
          ],
        },
        {
          node: <MenuItemTemplate icon={<EraserIcon />} label={'Clear content'} />,
          onEvent() {},
        },
      ],
    },
    {
      label: 'Edit table',
      items: [
        {
          node: <MenuItemTemplate icon={<ArrowIcon direction={'up'} />} label={'Add row above'} />,
          onEvent() {},
        },
        {
          node: <MenuItemTemplate icon={<ArrowIcon direction={'down'} />} label={'Add row below'} />,
          onEvent() {},
        },
        {
          node: <MenuItemTemplate icon={<ArrowIcon direction={'left'} />} label={'Add column to left'} />,
          onEvent() {},
        },
        {
          node: <MenuItemTemplate icon={<ArrowIcon direction={'right'} />} label={'Add column to right'} />,
          onEvent() {},
        },
      ],
    },
    {
      label: 'Select',
      items: [
        {
          node: <MenuItemTemplate icon={<HorizontalIcon />} label={'Select row'} />,
          onEvent() {},
        },
        {
          node: <MenuItemTemplate icon={<VerticalIcon />} label={'Select column'} />,
          onEvent() {},
        },
      ],
    },
  ];

  return {
    menuSections,
  };
}
