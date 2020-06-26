export interface NavItemProps {
  path: string;
  textId: string;
  iconName: string;
  match(path: string): boolean;
  children?: NavItemProps[];
}
