import { MenuSectionProps } from '@components/menu/components/menuSection';
import { MenuItemTemplate } from '@components/tableditor/components/menu/itemTemplate';
import { CellMenuProps } from '@components/tableditor/components/menu/cell/CellMenu';
import { ArrowIcon, EraserIcon, HorizontalIcon, PaintBucketIcon, PencilIcon, VerticalIcon } from '@icons/index';

export interface IUseCellMenuParams extends CellMenuProps {}

export interface IUseCellMenu {
  menuSections: MenuSectionProps[];
}

export function useCellMenu(params: IUseCellMenuParams): IUseCellMenu {
  const {} = params;

  const menuSections: MenuSectionProps[] = [
    {
      items: [
        {
          node: <MenuItemTemplate icon={<PaintBucketIcon />} label={'Background colors'} hasChildMenu />,
          sections: [],
        },
        {
          node: <MenuItemTemplate icon={<PencilIcon />} label={'Font colors'} hasChildMenu />,
          sections: [],
        },
        {
          node: <MenuItemTemplate icon={<EraserIcon />} label={'Clear content'} />,
          onEvent() {},
        },
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
