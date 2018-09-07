
import * as iD from "@/iD-2.7.1/modules"

import {vm,operate,getContext} from '@/script/operate';

import _clone from 'lodash-es/clone';
import _forEach from 'lodash-es/forEach';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _some from 'lodash-es/some';

import {
    event as d3_event,
    selectAll as d3_selectAll
} from 'd3-selection';

import { t, textDirection } from '@/iD-2.7.1/modules/util/locale';
import { tooltip } from '@/iD-2.7.1/modules/util/tooltip';
import { actionChangeTags } from '@/iD-2.7.1/modules/actions';
import { modeBrowse } from '@/iD-2.7.1/modules/modes';
import { svgIcon } from '@/iD-2.7.1/modules/svg';
import { uiPresetIcon } from '@/iD-2.7.1/modules/ui/preset_icon';
import { uiRawMemberEditor } from '@/iD-2.7.1/modules/ui/raw_member_editor';
import { uiRawMembershipEditor } from '@/iD-2.7.1/modules/ui/raw_membership_editor';
import { uiRawTagEditor } from '@/iD-2.7.1/modules/ui/raw_tag_editor';
import { uiTagReference } from '@/iD-2.7.1/modules/ui/tag_reference';
import { uiPresetEditor } from '@/iD-2.7.1/modules/ui/preset_editor';
import { utilRebind } from '@/iD-2.7.1/modules/util';


import { osmEntity, osmRelation } from '@/iD-2.7.1/modules/osm';
import {
  actionAddEntity,
  actionAddMember,
  actionChangeMember,
  actionDeleteMember,
  actionChangePreset
} from '@/iD-2.7.1/modules/actions';
import { modeSelect } from '@/iD-2.7.1/modules/modes';




/**
 * 创建关系对象
 */

var context = getContext();
// let id = 'w5682921185281';
// let inner = 'w5120213360640';
var relation;

const createRelation = (_,member)=>{
  context = _;
  // var member = { id: _entityID, type: context.entity(_entityID).type, role: role };
  // var member = {id:id,role:'',type:'way',index:0}
  // console.log(context)
  relation = osmRelation();

  context.perform(
      actionAddEntity(relation),
      actionAddMember(relation.id, member),
      t('operations.add.annotation.relation')
  );

  // console.log(relation,'relation')
  let enti = context.graph().hasEntity(relation.id);
  highLightEntity([member.id])
  return relation

}

const choose = (r)=>{

  relation = r;
  
  highLightEntity([relation.id])

  return
  // let presets = context.presets();
  // // console.log(presets.item("type/multipolygon"));
  // let preset = presets.item("type/multipolygon");
  // // console.log(presets,'r');
  // let currentPreset = null;
  // // var currentPreset=context.presets().item('area');
  // context.perform(
  //   actionChangePreset(id, currentPreset, preset),
  //   t('operations.change_tags.annotation')
  // );
  // var entity = context.entity(r.id),
  // memberships = [];
  // console.log(entity);
  // entity.members.forEach((member,index)=>{
  //   memberships.push({
  //       index: index,
  //       id: member.id,
  //       type: member.type,
  //       role: member.role,
  //       relation: entity,
  //       member: context.hasEntity(member.id)
  //   });
  // });



  
  // var member = { id: id, type: 'way', role: 'outer' };
  // context.perform(
  //     actionChangeMember(r.id, member, 0),
  //     t('operations.change_role.annotation')
  // );
  // console.log(r,'r')
  // setInnerRole({id:"w5120213360640",index:1,role:'inner',type:'way'},r.id)

}

const setInnerRole=(member,id)=>{
  
  context.perform(
      actionAddMember(id, member),
      t('operations.add_member.annotation')
  );


  let presets = context.presets();
  let currentPreset = presets.item('relation');
  let preset = presets.item("type/multipolygon")
  changePreset(id,currentPreset,preset);
  highLightEntity([id])
}

const changePreset=(id,currentPreset,preset)=>{
  context.perform(
    actionChangePreset(id,currentPreset,preset),
    t('operations.change_tags.annotation')
  )
}

/**
 * 高亮
 * @param {*} arr 
 */
const highLightEntity = (arr)=>{
  context.enter(modeSelect(context, arr));
};

/**
 * 定位并高亮
 * @param {} context 
 * @param {*} id 
 */
const positionEntity = (context,id)=>{
  let entity = context.graph().hasEntity(id)
  context.map().zoomTo(entity)
  context.enter(modeSelect(context,[id]));
}





export {
  createRelation,
  choose,
  setInnerRole,
  changePreset,
  highLightEntity,
  positionEntity
}

