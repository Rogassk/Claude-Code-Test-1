import Badge from '../common/Badge';
import { PRIORITIES } from '../../utils/constants';

export default function PriorityBadge({ priority }) {
  const p = PRIORITIES[priority] || PRIORITIES.medium;
  return <Badge color={p.color} bg={p.bg}>{p.label}</Badge>;
}
