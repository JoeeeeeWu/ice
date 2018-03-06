import mongoose from 'mongoose';

const WikiHouse = mongoose.model('WikiHouse');

export async function getHouses() {
  const data = await WikiHouse
    .find({})
    .populate({
      path: 'swornMembers.character',
      select: '_id name cname profile',
    })
    .exec();
  return data;
}
